import { useState } from "react"
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userState";
import { signinUser, signupUser } from "../../api/api";
import { UserSigninData, UserSignupData } from "../../types";



const Auth : React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSignup, setIsSignup] useState(false);
    const setUser = useRecoilState(userState);

    const handleSignIn = async () => {
        const data: UserSigninData = {username, password};
        try {
            const response =  await signinUser(data);
            setUser(response.data);
        } catch (error) {
            console.error('Signin failed', error);
        }
    }

    const handleSignUp = async () => {
        const data: UserSignupData = {firstName, lastName, username, password};
        try {
            const response = await signupUser(data);
            setUser(response.data);
            
        } catch (error) {
            console.error('Signup failed', error);
        }
    }

    return (
        <div>
            {isSignup && (
                <>
                    <input 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    />

                    <input 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                     />  
                </>
            )}
            <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username" 
            />
            <input 
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
             />
            <button onClick={isSignup ? handleSignUp : handleSignIn}>
                {isSignup ? 'signup' : 'signin'}
            </button>
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Switch to sign in' : 'Switch to sign up'}
            </button>
        </div>
    )
}

export default Auth;