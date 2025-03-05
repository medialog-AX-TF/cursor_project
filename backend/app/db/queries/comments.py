from ..connection import get_db_cursor

class CommentQueries:
    @staticmethod
    def create_comment(content: str, user_id: int, post_id: int, parent_id: int = None):
        """새로운 댓글을 생성합니다."""
        query = """
            INSERT INTO comments (content, user_id, post_id, parent_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id, content, user_id, post_id, parent_id, created_at;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (content, user_id, post_id, parent_id))
            return cur.fetchone()

    @staticmethod
    def get_comments_by_post(post_id: int):
        """게시글의 모든 댓글을 조회합니다."""
        query = """
            SELECT c.*, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = %s AND c.is_deleted = false
            ORDER BY 
                CASE WHEN c.parent_id IS NULL THEN c.id ELSE c.parent_id END,
                c.parent_id NULLS FIRST,
                c.created_at;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (post_id,))
            return cur.fetchall()

    @staticmethod
    def get_comment(comment_id: int):
        """댓글 ID로 댓글을 조회합니다."""
        query = """
            SELECT c.*, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = %s AND c.is_deleted = false;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (comment_id,))
            return cur.fetchone()

    @staticmethod
    def update_comment(comment_id: int, content: str):
        """댓글을 수정합니다."""
        query = """
            UPDATE comments
            SET content = %s
            WHERE id = %s AND is_deleted = false
            RETURNING id, content, user_id, post_id, parent_id, created_at, updated_at;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (content, comment_id))
            return cur.fetchone()

    @staticmethod
    def delete_comment(comment_id: int):
        """댓글을 삭제 표시합니다."""
        query = """
            UPDATE comments
            SET is_deleted = true
            WHERE id = %s
            RETURNING id;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (comment_id,))
            return cur.fetchone() is not None

    @staticmethod
    def get_replies(comment_id: int):
        """댓글의 답글을 조회합니다."""
        query = """
            SELECT c.*, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.parent_id = %s AND c.is_deleted = false
            ORDER BY c.created_at;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (comment_id,))
            return cur.fetchall() 