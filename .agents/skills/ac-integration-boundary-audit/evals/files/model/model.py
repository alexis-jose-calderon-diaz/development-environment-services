from dataclasses import dataclass


@dataclass
class Account:
    id: int
    timezone: str | None
