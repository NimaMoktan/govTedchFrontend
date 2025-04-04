export type Role = {
    id?: number; // Add this line
    code: string;
    role_name: string;
    privileges: string[]; // Assuming privilege IDs are strings
    active: string; // Assuming this is a string like "Y" or "N"
}