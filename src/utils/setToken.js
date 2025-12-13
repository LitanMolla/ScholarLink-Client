const setToken = async (user) => {
    const token = await user.getIdToken();
    localStorage.setItem("access-token", token);
    return token
}

export default setToken