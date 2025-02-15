import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

const Join = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const navigate = useNavigate();

    const onChangeUsernameHandler = (e) => {
        const usernameValue = e.target.value;
        setUsername(usernameValue);
        usernameCheckHandler(usernameValue);
    }

    const onChangePasswordHandler = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
        PasswordCheckHandler(passwordValue);
    }

    const onChangeConfirmPasswordHandler = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        ConfirmPasswordCheckHandler(password, confirmPasswordValue);
    }

    const onChangeNameHandler = (e) => {
        const nameValue = e.target.value;
        setName(nameValue);
    }

    const usernameCheckHandler = async (username) => {
        const usernameRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (username === '') {
            setUsernameError('이메일을 입력해주세요.');
        }
        else if (!usernameRegex.test(username)) {
            setUsernameError('올바른 이메일 형식이 아닙니다.');
        }
        else {
            setUsernameError('');
        }
    }

    const PasswordCheckHandler = async (password) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]{8,}$/;

        if (password === '') {
            setPasswordError('비밀번호를 입력해주세요.');
        }
        else if (!passwordRegex.test(password)) {
            setPasswordError('8자 이상, 숫자, 영문자, 특수문자(!%*#?&)를 포함해야 합니다.');
        }
        else {
            setPasswordError('');
        }
    }

    const ConfirmPasswordCheckHandler = async (password, confirmPassword) => {

        if (confirmPassword === '') {
            setConfirmPasswordError('비밀번호를 입력해주세요.');
        }
        else if (password !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        }
        else {
            setConfirmPasswordError('');
        }
    }

    const submitHandle = async (e) => {
        e.preventDefault();

        const data = {
            username: username,
            name: name,
            password: password,
            confirmPassword: confirmPassword
        };

        try {
            const response = await axios.post('https://front-mission.bigs.or.kr/auth/signup', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('회원가입 성공:', response.data);
            alert("회원가입 성공");

            navigate('/');

        } catch (error) {
            if (error.response.data.username) {
                console.error('회원가입 실패:', error.response || error.message);
                alert(error.response.data.username[0] || "회원가입 실패");
            } else {
                console.error('회원가입 실패:', error.response || error.message);
                alert("회원가입 실패");
            }
        }
    };

    const isAllInputFilled = username && password && confirmPassword && name;

    const isSubmitDisabled = usernameError || passwordError || confirmPasswordError || !isAllInputFilled;

    

    return (
        <>
            <div id="join">
                <div className="wrap">
                    <div>
                        <Link to="/">←</Link>
                    </div>
                    <div className="title">회원가입</div>

                    <form onSubmit={submitHandle}>

                        <div className="id">
                            <p>이메일</p>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="이메일 주소를 입력해 주세요"
                                onChange={onChangeUsernameHandler}
                            />
                            {usernameError && <p className="usernameError">{usernameError}</p>}
                        </div>

                        <div className="pw">
                            <p>비밀번호</p>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호를 입력해 주세요"
                                onChange={onChangePasswordHandler}
                            />
                            {passwordError && <p className="passwordError">{passwordError}</p>}
                        </div>

                        <div className="pwCheck">

                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="비밀번호 확인"
                                onChange={onChangeConfirmPasswordHandler}
                            />
                            {confirmPasswordError && <p className="confirmPasswordError">{confirmPasswordError}</p>}
                        </div>

                        <div className="nameCheck">
                            <p>이름</p>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="이름을 입력해 주세요"
                                onChange={onChangeNameHandler}
                            />
                        </div>

                        <button
                            className={`submitBtn ${isSubmitDisabled ? 'disabled' : ''}`}
                            type="submit"
                            disabled={isSubmitDisabled}
                        >
                            회원가입
                        </button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Join;