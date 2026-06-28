"use server";

// Admin login is now handled by the shared /auth/login flow.
// Role is embedded in the JWT; middleware enforces /admin access.
// This file is kept to avoid broken imports but exports nothing.
