const ScreenCapture = () => {
    const handleClick = async (e) => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false, 
            });

            e.target.srcObject = stream;

            stream.getVideoTracks()[0].addEventListener("ended", () => {
                console.log("Window sharing stopped.");
                e.target.srcObject = null;
            });

        } catch (err) {
            console.error("Error sharing window:", err);
        }
    }

    return <video id="video" src="" onClick={handleClick} className="w-full h-full cursor-pointer relative" autoPlay playsInline></video>;
};

export default ScreenCapture;