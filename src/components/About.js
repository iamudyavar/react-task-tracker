import { Link } from 'react-router-dom'

const About = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'white', textAlign: 'center' }}> Version 1.0.0</h4>
            <Link to="/">Go Back</Link>
        </div>
    )
}

export default About