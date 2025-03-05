from ..connection import get_db_cursor

class PostQueries:
    @staticmethod
    def create_post(title: str, content: str, user_id: int, category_id: int):
        """새로운 게시글을 생성합니다."""
        query = """
            INSERT INTO posts (title, content, user_id, category_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id, title, content, user_id, category_id, view_count, created_at;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (title, content, user_id, category_id))
            return cur.fetchone()

    @staticmethod
    def get_post(post_id: int):
        """게시글 ID로 게시글을 조회합니다."""
        query = """
            SELECT p.*, u.username, c.name as category_name
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = %s AND p.is_deleted = false;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (post_id,))
            return cur.fetchone()

    @staticmethod
    def get_posts(category_id: int = None, page: int = 1, per_page: int = 20):
        """게시글 목록을 조회합니다."""
        offset = (page - 1) * per_page
        base_query = """
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.is_deleted = false
        """
        
        if category_id:
            base_query += " AND p.category_id = %s"
            params = (category_id, per_page, offset)
        else:
            params = (per_page, offset)

        # 전체 게시글 수 조회
        count_query = f"SELECT COUNT(*) {base_query}"
        with get_db_cursor() as cur:
            if category_id:
                cur.execute(count_query, (category_id,))
            else:
                cur.execute(count_query)
            total_count = cur.fetchone()[0]

        # 게시글 목록 조회
        query = f"""
            SELECT p.*, u.username, c.name as category_name
            {base_query}
            ORDER BY p.created_at DESC
            LIMIT %s OFFSET %s;
        """
        
        with get_db_cursor() as cur:
            cur.execute(query, params)
            posts = cur.fetchall()

        return posts, total_count

    @staticmethod
    def update_post(post_id: int, **kwargs):
        """게시글을 수정합니다."""
        allowed_fields = {'title', 'content', 'category_id', 'is_deleted'}
        update_fields = {k: v for k, v in kwargs.items() if k in allowed_fields and v is not None}
        
        if not update_fields:
            return None

        query = """
            UPDATE posts
            SET {}
            WHERE id = %s
            RETURNING id, title, content, user_id, category_id, view_count, created_at, updated_at;
        """.format(
            ', '.join(f"{k} = %s" for k in update_fields.keys())
        )
        
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (*update_fields.values(), post_id))
            return cur.fetchone()

    @staticmethod
    def delete_post(post_id: int):
        """게시글을 삭제 표시합니다."""
        query = """
            UPDATE posts
            SET is_deleted = true
            WHERE id = %s
            RETURNING id;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (post_id,))
            return cur.fetchone() is not None

    @staticmethod
    def increment_view_count(post_id: int):
        """게시글 조회수를 증가시킵니다."""
        query = """
            UPDATE posts
            SET view_count = view_count + 1
            WHERE id = %s;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (post_id,)) 