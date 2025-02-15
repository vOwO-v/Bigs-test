import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onChangeUsernameHandler = (e) => {
        const usernameValue = e.target.value;
        setUsername(usernameValue);
    }

    const onChangePasswordHandler = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
    }

    const loginHandle = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://front-mission.bigs.or.kr/auth/signin', {
                username: username,
                password: password
            });

            if (response.status === 200) {

                const { accessToken, refreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                navigate('/list');

            }
        } catch (error) {

            alert("로그인에 실패했습니다. 이메일이나 비밀번호를 확인해 주세요.");
            console.error('로그인 오류', error);
        }

    };


    return (
        <>
            <div id="login">
                <div className="wrap">
                    <div className="title">로그인</div>

                    <form onSubmit={loginHandle}>
                        <div className="loginForm">
                            <p>이메일</p>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="이메일 주소를 입력해 주세요"
                                onChange={onChangeUsernameHandler}
                            />
                            <p>비밀번호</p>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호를 입력해 주세요"
                                onChange={onChangePasswordHandler}
                            />
                        </div>

                        <button className="submitBtn" type="submit">
                            로그인
                        </button>

                    </form>
                    <p className="joinBtn"><Link to="/join">회원가입</Link></p>
                </div>
            </div>
        </>
    )
}

export default Login;