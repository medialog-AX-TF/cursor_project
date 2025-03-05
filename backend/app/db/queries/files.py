from ..connection import get_db_cursor

class FileQueries:
    @staticmethod
    def create_file(filename: str, original_filename: str, file_path: str, 
                   file_size: int, mime_type: str, post_id: int, user_id: int):
        """새로운 파일을 생성합니다."""
        query = """
            INSERT INTO files (filename, original_filename, file_path, file_size, 
                             mime_type, post_id, user_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, filename, original_filename, file_path, file_size, 
                      mime_type, post_id, user_id, created_at;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (filename, original_filename, file_path, file_size,
                              mime_type, post_id, user_id))
            return cur.fetchone()

    @staticmethod
    def get_files_by_post(post_id: int):
        """게시글의 모든 파일을 조회합니다."""
        query = """
            SELECT f.*, u.username
            FROM files f
            JOIN users u ON f.user_id = u.id
            WHERE f.post_id = %s
            ORDER BY f.created_at;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (post_id,))
            return cur.fetchall()

    @staticmethod
    def get_file(file_id: int):
        """파일 ID로 파일을 조회합니다."""
        query = """
            SELECT f.*, u.username
            FROM files f
            JOIN users u ON f.user_id = u.id
            WHERE f.id = %s;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (file_id,))
            return cur.fetchone()

    @staticmethod
    def delete_file(file_id: int):
        """파일을 삭제합니다."""
        query = """
            DELETE FROM files
            WHERE id = %s
            RETURNING id, file_path;
        """
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (file_id,))
            return cur.fetchone()

    @staticmethod
    def get_files_by_user(user_id: int):
        """사용자가 업로드한 모든 파일을 조회합니다."""
        query = """
            SELECT f.*, p.title as post_title
            FROM files f
            JOIN posts p ON f.post_id = p.id
            WHERE f.user_id = %s
            ORDER BY f.created_at DESC;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchall()