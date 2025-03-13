// This file is automatically generated. Do not edit it directly.
import { createClient } from "@supabase/supabase-js";
import type { Database } from './types';

// Use environment variables or fallback to hardcoded values if needed
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://houhjguqdfolfqnzbkrs.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdWhqZ3VxZGZvbGZxbnpia3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjkwMjYsImV4cCI6MjA1Njk0NTAyNn0.P3Pis60wqIGniZftExxYOL6xBQ8JHKTQdHlZ0AsdkD0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create a local storage fallback mechanism for when Supabase connection fails
export const getLocalStorageSupabaseClient = () => {
  // Basic methods to simulate Supabase functionality using localStorage
  const localStorageClient = {
    auth: {
      getSession: async () => {
        try {
          const session = localStorage.getItem("sb-session");
          return {
            data: { session: session ? JSON.parse(session) : null },
            error: null,
          };
        } catch (error) {
          console.error("Error getting local session:", error);
          return { data: { session: null }, error };
        }
      },
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        try {
          const users = JSON.parse(localStorage.getItem("sb-users") || "[]");
          const user = users.find(
            (u: any) => u.email === email && u.password === password
          );

          if (user) {
            const session = {
              user: { id: user.id, email: user.email },
              expires_at: Date.now() + 3600000,
            };
            localStorage.setItem("sb-session", JSON.stringify(session));
            return { data: { user: { id: user.id, email: user.email } }, error: null };
          }

          return {
            data: { user: null },
            error: { message: "Invalid login credentials" },
          };
        } catch (error) {
          console.error("Error signing in:", error);
          return { data: { user: null }, error };
        }
      },
      signUp: async ({
        email,
        password,
        options,
      }: {
        email: string;
        password: string;
        options?: any;
      }) => {
        try {
          const users = JSON.parse(localStorage.getItem("sb-users") || "[]");
          const existingUser = users.find((u: any) => u.email === email);

          if (existingUser) {
            return { data: { user: null }, error: { message: "User already exists" } };
          }

          const newUser = { id: `user-${Date.now()}`, email, password, ...options?.data };
          users.push(newUser);
          localStorage.setItem("sb-users", JSON.stringify(users));

          // Create default profile
          const profiles = JSON.parse(localStorage.getItem("sb-profiles") || "[]");
          profiles.push({ id: newUser.id, first_name: "", last_name: "" });
          localStorage.setItem("sb-profiles", JSON.stringify(profiles));

          return { data: { user: { id: newUser.id, email: newUser.email } }, error: null };
        } catch (error) {
          console.error("Error signing up:", error);
          return { data: { user: null }, error };
        }
      },
      signOut: async () => {
        localStorage.removeItem("sb-session");
        return { error: null };
      },
      onAuthStateChange: (callback: Function) => {
        const subscription = { unsubscribe: () => {} };
        return { data: { subscription } };
      }
    },
    // Use keyof Database instead of Database["Tables"] to avoid "Tables" property errors.
    from: (table: keyof Database) => {
      const key = String(table);
      return {
        select: () => {
          const data = JSON.parse(localStorage.getItem(`sb-${key}`) || "[]");
          return {
            eq: (column: string, value: any) => {
              const filtered = data.filter((item: any) => item[column] === value);
              return {
                data: filtered,
                error: null,
                single: () => ({ data: filtered[0] || null, error: null }),
                maybeSingle: () => ({ data: filtered[0] || null, error: null }),
              };
            },
            data,
            error: null
          };
        },
        insert: (values: any) => {
          try {
            const data = JSON.parse(localStorage.getItem(`sb-${key}`) || "[]");
            if (Array.isArray(values)) {
              values.forEach((value) => {
                if (!value.id)
                  value.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                data.push(value);
              });
            } else {
              if (!values.id)
                values.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              data.push(values);
            }
            localStorage.setItem(`sb-${key}`, JSON.stringify(data));
            return { data: values, error: null };
          } catch (error) {
            console.error(`Error inserting into ${key}:`, error);
            return { data: null, error };
          }
        },
        update: (values: any) => {
          return {
            eq: (column: string, value: any) => {
              try {
                const data = JSON.parse(localStorage.getItem(`sb-${key}`) || "[]");
                const index = data.findIndex((item: any) => item[column] === value);
                if (index !== -1) {
                  data[index] = { ...data[index], ...values };
                  localStorage.setItem(`sb-${key}`, JSON.stringify(data));
                  return { data: data[index], error: null };
                }
                return { data: null, error: { message: "Item not found" } };
              } catch (error) {
                console.error(`Error updating ${key}:`, error);
                return { data: null, error };
              }
            }
          };
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              try {
                const data = JSON.parse(localStorage.getItem(`sb-${key}`) || "[]");
                const newData = data.filter((item: any) => item[column] !== value);
                localStorage.setItem(`sb-${key}`, JSON.stringify(newData));
                return { error: null };
              } catch (error) {
                console.error(`Error deleting from ${key}:`, error);
                return { error };
              }
            }
          };
        }
      };
    }
  };

  return localStorageClient;
};

// Create a wrapped client that tries Supabase first, then falls back to localStorage
export const createFallbackClient = () => {
  const localClient = getLocalStorageSupabaseClient();

  return {
    auth: {
      getSession: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          return { data, error: null };
        } catch (error) {
          console.warn("Falling back to local storage for auth.getSession");
          return localClient.auth.getSession();
        }
      },
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword(credentials);
          if (error) throw error;
          return { data, error: null };
        } catch (error) {
          console.warn("Falling back to local storage for auth.signInWithPassword");
          return localClient.auth.signInWithPassword(credentials);
        }
      },
      signUp: async (credentials: { email: string; password: string; options?: any }) => {
        try {
          const { data, error } = await supabase.auth.signUp(credentials);
          if (error) throw error;
          return { data, error: null };
        } catch (error) {
          console.warn("Falling back to local storage for auth.signUp");
          return localClient.auth.signUp(credentials);
        }
      },
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          return { error: null };
        } catch (error) {
          console.warn("Falling back to local storage for auth.signOut");
          return localClient.auth.signOut();
        }
      },
      onAuthStateChange: (callback: Function) => {
        try {
          return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
          });
        } catch (error) {
          console.warn("Falling back to local storage for auth.onAuthStateChange");
          return localClient.auth.onAuthStateChange(callback);
        }
      }
    },
    from: (table: keyof Database) => {
      const key = String(table);
      return {
        select: () => {
          try {
            // Casting table as any to satisfy overload types
            const query = supabase.from(table as any).select();
            return {
              ...query,
              eq: async (column: string, value: any) => {
                try {
                  const { data, error } = await supabase.from(table as any).select().eq(column, value);
                  if (error) throw error;
                  return {
                    data,
                    error: null,
                    single: async () => {
                      try {
                        const { data, error } = await supabase.from(table as any).select().eq(column, value).single();
                        if (error) throw error;
                        return { data, error: null };
                      } catch (error) {
                        console.warn("Falling back to local storage for single query");
                        return localClient.from(table).select().eq(column, value).single();
                      }
                    },
                    maybeSingle: async () => {
                      try {
                        const { data, error } = await supabase.from(table as any).select().eq(column, value).maybeSingle();
                        if (error) throw error;
                        return { data, error: null };
                      } catch (error) {
                        console.warn("Falling back to local storage for maybeSingle query");
                        return localClient.from(table).select().eq(column, value).maybeSingle();
                      }
                    },
                  };
                } catch (error) {
                  console.warn(`Falling back to local storage for ${key}.select().eq()`);
                  return localClient.from(table).select().eq(column, value);
                }
              }
            };
          } catch (error) {
            console.warn(`Falling back to local storage for ${key}.select()`);
            return localClient.from(table).select();
          }
        },
        insert: async (values: any) => {
          try {
            const { data, error } = await supabase.from(table as any).insert(values);
            if (error) throw error;
            return { data, error: null };
          } catch (error) {
            console.warn(`Falling back to local storage for ${key}.insert()`);
            return localClient.from(table).insert(values);
          }
        },
        update: (values: any) => {
          return {
            eq: async (column: string, value: any) => {
              try {
                const { data, error } = await supabase.from(table as any).update(values).eq(column, value);
                if (error) throw error;
                return { data, error: null };
              } catch (error) {
                console.warn(`Falling back to local storage for ${key}.update().eq()`);
                return localClient.from(table).update(values).eq(column, value);
              }
            }
          };
        },
        delete: () => {
          return {
            eq: async (column: string, value: any) => {
              try {
                const { error } = await supabase.from(table as any).delete().eq(column, value);
                if (error) throw error;
                return { error: null };
              } catch (error) {
                console.warn(`Falling back to local storage for ${key}.delete().eq()`);
                return localClient.from(table).delete().eq(column, value);
              }
            }
          };
        }
      };
    }
  };
};

// Export the fallback client for use throughout the application
export const supabaseFallback = createFallbackClient();
