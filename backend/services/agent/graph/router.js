export const router = async (state) => {
    // for now it will only return chat
    return {
        ...state,
        agent:"chat"
    }
}