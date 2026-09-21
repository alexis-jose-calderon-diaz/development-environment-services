const user = await loadUser(7);
if (user.displayName !== "Ada") throw new Error("display name missing");
