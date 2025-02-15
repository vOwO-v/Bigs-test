import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";

const Write = ({handleCloseWrite}) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('NOTICE');
    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/');
        }
    }, [navigate]);

    const onChangeTitleHandler = (e) => {
        const titleValue = e.target.value;
        setTitle(titleValue);
    }

    const onChangeContentHandler = (e) => {
        const contentValue = e.target.value;
        setContent(contentValue);
    }

    const onChangeCategoryHandler = (e) => {
        const categoryValue = e.target.value;
        setCategory(categoryValue);
    }

    const onChangeFileHandler = (e) => {
        const fileValue = e.target.files[0];
        setFile(fileValue);
    }

    const handleFileRemove = () => {
        setFile(null);
    }

    const submitHandle = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        const request = {
            title,
            content,
            category
        };

        const json = JSON.stringify(request);
        const blob = new Blob([json], { type: "application/json" });

        formData.append("request", blob);

        if (file) {
            formData.append('file', file);
        }

        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post('https://front-mission.bigs.or.kr/boards', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response.data);

            alert("게시글 작성 성공")

            handleCloseWrite();

        } catch (error) {
            console.error('Error posting data:', error);

            alert('게시글 작성 실패');
            navigate('/');
        }
    };

    return (
        <>
            <div id="write">

                <button className="closeBtn" onClick={handleCloseWrite}>X</button>

                <div className="wrap">
                    <div className="title">글쓰기</div>

                    <div className="formBox">
                        <form onSubmit={submitHandle}>
                            <div className="inner1">
                                <div>카테고리</div>
                                <select
                                    id="category"
                                    name="category"
                                    onChange={onChangeCategoryHandler}
                                >
                                    <option value="NOTICE">공지</option>
                                    <option value="FREE">자유</option>
                                    <option value="QNA">Q&A</option>
                                    <option value="ETC">기타</option>
                                </select>
                            </div>
                            <div className="inner2">
                                <div>제목</div>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    onChange={onChangeTitleHandler}
                                />
                            </div>
                            <div className="inner3">
                                <div>내용</div>
                                <textarea
                                    id="content"
                                    name="content"
                                    onChange={onChangeContentHandler}
                                />
                            </div>

                            <div className="inner4">
                                <div>파일첨부</div>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={onChangeFileHandler}
                                />
                                {file && (
                                    <div>
                                        <div>파일목록</div>
                                        <div className="fileList">
                                            <p>{file.name}</p>
                                            <button type="button" onClick={handleFileRemove}>파일 삭제</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="inner5">
                                <div onClick={handleCloseWrite}>
                                    취소
                                </div>
                                <button type="submit">등록</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Write;