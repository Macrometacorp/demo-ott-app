import "./playAnimation.scss"
import { useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"

const PlayAnimation = () => {
    let history = useHistory()
    const soundRef = useRef(null)
    const handleTadum = () => {
        console.log(soundRef.current)
        // soundRef.current.currentTime = 0;
        // soundRef.current.play();
    }

    useEffect(() => {
        handleTadum()
        setTimeout(() => {
            history.push("/browse")
        }, 4200)
    }, [history])

    return (
        <div className="PlayAnimation__wrp">
            <span className="PlayAnimation__text">MACROMETA</span>
        </div>
    )
}

export default PlayAnimation
