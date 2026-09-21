from dataclasses import asdict, dataclass


@dataclass
class User:
    id: int
    display_name: str


def get_user(user_id: int) -> tuple[int, dict]:
    return 200, asdict(User(user_id, "Ada"))
