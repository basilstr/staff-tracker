export const inviteFormatter = (invite) => `${import.meta.env.VITE_API_BASE_URL}/login/${invite}`;

export const mapClientData = (data) => {
    if(!data.invite || !data.expired_at) return {}
    return {
        invite: inviteFormatter(data.invite),
        expiredAt: data.expired_at
    }
}
