import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";
import Edit from "./edit";

const Read = ({ id, handleCloseModal }) => {


    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

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

            setPost(response.data);
            setLoading(false);

        } catch (error) {
            console.error("게시글 조회에 실패했습니다.", error);
            setLoading(false);
            alert('게시글을 불러오는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchPostData();
    }, [id]);

    const deletePost = async () => {

        const isConfirmed = window.confirm('정말 삭제하시겠습니까?');

        if (isConfirmed) {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    alert('로그인이 필요합니다.');
                    navigate('/');
                }

                const response = await axios.delete(`https://front-mission.bigs.or.kr/boards/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                alert('게시글이 삭제되었습니다.');
                handleCloseModal();
                
            } catch (error) {
                console.error("게시글 삭제에 실패했습니다.", error);
                alert('게시글 삭제에 실패했습니다.');
            }
        } else {

        }
    };

    if (loading) {
        return (
            <>
                <div id="read">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <div id="read">
                    <p>게시글을 찾을 수 없습니다.</p>
                </div>
            </>
        );
    }

    const categoryMapping = {
        "NOTICE": "공지",
        "FREE": "자유",
        "QNA": "Q&A",
        "ETC": "기타"
    };

    const openEditModal = (id) => {
        setModalOpen(true); 
    };

    const closeEditModal = () => {
        setModalOpen(false); 
        setLoading(true);
        fetchPostData();
    };

    return (
        <div id="read">

            <button className="closeBtn" onClick={handleCloseModal}>X</button>

            <div className="wrap">

                <div className="title">게시글</div>

                <div className="readBox">
                    <div className="inner1">
                        <div>카테고리</div>
                        <div>[{categoryMapping[post.boardCategory]}]</div>
                    </div>
                    <div className="inner2">
                        <div>제목</div>
                        <div className="innerTitle">{post.title}</div>
                    </div>
                    <div className="inner3">
                        <div>내용</div>
                        <div className="innerContent">{post.content}
                            <div>{post.imageUrl && <img src={`https://front-mission.bigs.or.kr${post.imageUrl}`} alt="게시글 이미지" />}</div>
                        </div>
                    </div>
                    <div className="inner4">
                        <div>작성일: {new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="inner5">
                        <div className="listBtn" onClick={handleCloseModal}>
                            목록
                        </div>
                        <div className="editBtn" onClick={openEditModal}>
                            수정
                        </div>
                        <div className="delBtn">
                            <button onClick={deletePost}>삭제</button>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="modalContent">
                        <Edit id={id} closeEditModal={closeEditModal} />
                    </div>
                </div>
            )}

        </div>
    );
}

export default Read;
