import {apiPost, apiPut, ApiResponse} from "@/api/client";
import {UserDto} from "@/api/auth";

export type UpdateProfileReq = {
    displayName: string;
    email: string;
};

export function updateProfile(data: UpdateProfileReq): Promise<ApiResponse<UserDto>> {
    return apiPut<UserDto>('/users/profile', data);
}

export function verifyEmailChange(token: string): Promise<ApiResponse<string>> {
    return apiPost<string>(`/users/verify-email-change?token=${token}`);
}

export function changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<string>> {
    return apiPost<string>('/users/change-password', { currentPassword, newPassword });
}