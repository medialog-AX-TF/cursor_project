from ..connection import get_db_cursor
from psycopg2.errors import UniqueViolation

class UserQueries:
    @staticmethod
    def create_user(username: str, email: str, password_hash: str, full_name: str = None):
        """새로운 사용자를 생성합니다."""
        query = """
            INSERT INTO users (username, email, password_hash, full_name)
            VALUES (%s, %s, %s, %s)
            RETURNING id, username, email, full_name, is_active, is_admin, created_at;
        """
        with get_db_cursor(commit=True) as cur:
            try:
                cur.execute(query, (username, email, password_hash, full_name))
                return cur.fetchone()
            except UniqueViolation:
                return None

    @staticmethod
    def get_user_by_username(username: str):
        """사용자 이름으로 사용자를 조회합니다."""
        query = """
            SELECT id, username, email, password_hash, full_name, is_active, is_admin, created_at
            FROM users
            WHERE username = %s;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (username,))
            return cur.fetchone()

    @staticmethod
    def get_user_by_email(email: str):
        """이메일로 사용자를 조회합니다."""
        query = """
            SELECT id, username, email, password_hash, full_name, is_active, is_admin, created_at
            FROM users
            WHERE email = %s;
        """
        with get_db_cursor() as cur:
            cur.execute(query, (email,))
            return cur.fetchone()

    @staticmethod
    def update_user(user_id: int, **kwargs):
        """사용자 정보를 업데이트합니다."""
        allowed_fields = {'username', 'email', 'password_hash', 'full_name', 'is_active'}
        update_fields = {k: v for k, v in kwargs.items() if k in allowed_fields and v is not None}
        
        if not update_fields:
            return None

        query = """
            UPDATE users
            SET {} 
            WHERE id = %s
            RETURNING id, username, email, full_name, is_active, is_admin, created_at;
        """.format(
            ', '.join(f"{k} = %s" for k in update_fields.keys())
        )
        
        with get_db_cursor(commit=True) as cur:
            try:
                cur.execute(query, (*update_fields.values(), user_id))
                return cur.fetchone()
            except UniqueViolation:
                return None

    @staticmethod
    def delete_user(user_id: int):
        """사용자를 삭제합니다."""
        query = "DELETE FROM users WHERE id = %s RETURNING id;"
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone() is not None 