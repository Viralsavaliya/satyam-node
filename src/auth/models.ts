import {AdminRole, UserType} from "../utils/enum";

export interface UserTokenPayload {
    userId: string
    userType: UserType
    createdAt: string
}

export interface AdminTokenPayload {
    userId: string
    adminRole: AdminRole
    createdAt: string
}

export enum UserTokenRole {
    accessToken = "access",
    adminAccessToken = "admin_access",
    refreshToken = "refresh",
    registerToken = "register",
    resetPasswordToken = "reset_password",
    loginToken = "login",
}

export interface OtpRequestPayload {
    createdAt: Date,
    accessToken: string,
    otp: number,
    verify: boolean,
    type: string,
}

export interface LoginRequestPayload extends OtpRequestPayload {
    userId: string,
    pushToken: string | undefined,
}

export interface RegisterRequestPayload extends OtpRequestPayload {
    userData: any,
}

export interface ResetPasswordRequestPayload extends OtpRequestPayload {
    userId: string,
}
