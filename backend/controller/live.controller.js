export const liveServer = async (req, res) => {
    try {
        res.status(200).json({
            message: "server is on live"
        })
    } catch (e) {
        res.status(500).json()
        {
            message: "server in offline", e
        }
    }
}