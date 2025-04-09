export type User = {
    id?: any; // Made optional
    userName: string;
    cidNumber: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    userRoles: object[];
    active: string;
    message?: string;
}