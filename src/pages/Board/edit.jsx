import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";

const Edit = ({ id, closeEditModal }) => {
    const [post, setPost] = useState(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('NOTICE');
    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchPostData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    alert('로그인이 필요합니다.');
                    navigate('/');
                }

                const response = await axios.get(`https://front-mission.bigs.or.kr/boards/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const postData = response.data;
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);
                setCategory(postData.boardCategory);

                if (postData.imageUrl) {
                    setFile({ name: postData.imageUrl.split('/').pop() });
                }

            } catch (error) {

                alert('게시글을 불러오는 데 실패했습니다.');
            }
        };

        fetchPostData();
    }, [id, navigate]);

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
            category,
        };

        const json = JSON.stringify(request);
        const blob = new Blob([json], { type: "application/json" });

        formData.append("request", blob);

        if (file) {
            formData.append('file', file);
        }



        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.patch(`https://front-mission.bigs.or.kr/boards/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            console.log(response.data);
            alert("게시글 수정 성공");
            closeEditModal();

        } catch (error) {
            console.error('Error posting data:', error);
            
            if (error.response && error.response.data.message.includes("MaxUploadSizeExceededException")) {
                alert('파일 용량이 초과되었습니다');
            } else {
                alert('게시글 수정 실패');
            }
        }
    };

    if (!post) {
        return (
            <>
                <div id="edit">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div id="edit">
                <button className="closeBtn" onClick={closeEditModal}>X</button>

                <div className="wrap">
                    <div className="title">글수정</div>

                    <div className="formBox">
                        <form onSubmit={submitHandle}>
                            <div className="inner1">
                                <div>카테고리</div>
                                <select
                                    id="category"
                                    name="category"
                                    value={category}
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
                                    value={title}
                                    onChange={onChangeTitleHandler}
                                />
                            </div>
                            <div className="inner3">
                                <div>내용</div>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={content}
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
                                <div onClick={closeEditModal}>
                                    취소
                                </div>
                                <button type="submit">수정</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Edit;
