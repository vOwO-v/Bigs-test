import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";
import Read from "./read";
import Write from "./write";

const List = () => {
    const [boardList, setBoardList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [decJson, setDecJson] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const [writeOpen, setwriteOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSet, setPageSet] = useState(1);

    const [timeLeft, setTimeLeft] = useState(30);

    const navigate = useNavigate();

    const fetchData = async (number) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const payload = accessToken.substring(accessToken.indexOf(".") + 1, accessToken.lastIndexOf("."));

            const base64Decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

            const decodingInfo = decodeURIComponent(escape(base64Decoded));

            const jsonParse = JSON.parse(decodingInfo);
            setDecJson(jsonParse);

            if (!accessToken) {
                alert('로그인이 필요합니다.');
                navigate('/');
            }

            const exp = jsonParse.exp;
            const currentTime = Math.floor(Date.now() / 1000)
            const timeLeft = exp - currentTime;

            if (timeLeft <= 0) {
                alert('로그인 시간이 만료되었습니다.');
                navigate('/');
            } else {
                setTimeLeft(timeLeft);
            }

            const page = number - 1;

            const response = await axios.get(`https://front-mission.bigs.or.kr/boards?page=${page}&size=10`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setBoardList(response.data.content);

            setTotalPages(Math.ceil(response.data.totalElements / 10));

            setLoading(false);

        } catch (error) {
            setLoading(false);
            alert('로그인이 필요합니다.');
            navigate('/');
        }
    };

    useEffect(() => {
        fetchData(currentPage);

        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    alert('로그인 시간이 만료되었습니다.');
                    navigate('/');
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); 

        return () => clearInterval(interval);



    }, [currentPage]);

    if (loading) {
        return (
            <>
                <div id="list">
                    <p>Loading...</p>
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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevSet = () => {
        setPageSet(pageSet - 1);
        setCurrentPage((pageSet - 2) * 10 + 1);
    };

    const handleNextSet = () => {
        setPageSet(pageSet + 1);
        setCurrentPage(pageSet * 10 + 1);
    };

    const startPage = (pageSet - 1) * 10 + 1;
    const endPage = Math.min(pageSet * 10, totalPages);

    const isPrevDisabled = pageSet === 1;
    const isNextDisabled = pageSet === Math.ceil(totalPages / 10);

    const handleReset = () => {
        setCurrentPage(1);
        setPageSet(1);
    };

    const handlePostClick = (postId) => {
        setModalOpen(true);
        setSelectedPost(postId);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPost(null);
        fetchData(currentPage);
    };

    const handleWriteClick = () => {
        setwriteOpen(true);
    };

    const handleCloseWrite = () => {
        setwriteOpen(false);
        fetchData(currentPage);
    };

    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleRefreshClick = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                alert('만료되었습니다. 다시 로그인 해주세요.');
                navigate('/');
                return;
            }

            const response = await axios.post('https://front-mission.bigs.or.kr/auth/refresh', {
                refreshToken: refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            const payload = accessToken.substring(accessToken.indexOf(".") + 1, accessToken.lastIndexOf("."));
            const base64Decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            const decodingInfo = decodeURIComponent(escape(base64Decoded));
            const jsonParse = JSON.parse(decodingInfo);
            setDecJson(jsonParse);

            const exp = jsonParse.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            const newTimeLeft = exp - currentTime;
            setTimeLeft(newTimeLeft);

        } catch (error) {
            alert('만료되었습니다. 다시 로그인 해주세요.');
            navigate('/');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        navigate('/');
    };

    return (
        <>
            <div id="list">
                <div className="wrap">
                    <div className="title">게시판</div>

                    <div className="box0">

                        <div className="inner1">
                            <div className="top">
                                나의 정보
                            </div>
                            <div className="userInfo">
                                <div className="name">
                                    <div>
                                        이름: {decJson.name}
                                    </div>
                                    <div className="logout" onClick={handleLogout}>
                                        로그아웃
                                    </div>
                                </div>
                                <div className="userName">
                                    이메일: {decJson.username}
                                </div>
                                <div className="timer">
                                    <div>남은 시간: {formatTimeLeft(timeLeft)}</div>
                                    <div className="timerBtn" onClick={handleRefreshClick}>시간 연장</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="box1">
                        <div className="inner1">
                            <p>번호</p>
                        </div>
                        <div className="inner2">
                            <p>분류</p>
                        </div>
                        <div className="inner3">
                            <p>제목</p>
                        </div>
                        <div className="inner4">
                            <p>등록일시</p>
                        </div>
                    </div>


                    <div className="box2">
                        {boardList.length === 0 ? (
                            <div className="noList">등록된 게시글이 없습니다.</div>
                        ) : (
                            boardList.map((item) => (
                                <div key={item.id} className="box2Inner">
                                    <div className="inner1">
                                        <p>
                                            {item.id}
                                        </p>
                                    </div>
                                    <div className="inner2">
                                        <p>
                                            {categoryMapping[item.category]}
                                        </p>
                                    </div>
                                    <div className="inner3">
                                        <p>
                                            <button onClick={() => handlePostClick(item.id)}>
                                                {item.title}
                                            </button>
                                        </p>
                                    </div>
                                    <div className="inner4">
                                        <p>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )))}
                    </div>

                    <div className="box3">
                        <div className="inner1">
                            <button onClick={handleReset}>목록</button>
                        </div>
                        <div className="inner2" onClick={handleWriteClick}>
                            글쓰기
                        </div>
                    </div>

                    <div className="pagination">

                        {!isPrevDisabled && (
                            <button
                                onClick={handlePrevSet}
                                className="change_page"
                            >
                                &lt;
                            </button>
                        )}

                        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
                            <button
                                key={index}
                                className={currentPage === startPage + index ? 'now_page' : 'change_page'}
                                onClick={() => handlePageChange(startPage + index)}
                            >
                                {startPage + index}
                            </button>
                        ))}

                        {!isNextDisabled && (
                            <button
                                onClick={handleNextSet}
                                className="change_page"
                            >
                                &gt;
                            </button>
                        )}
                    </div>

                </div>
                {modalOpen && (
                    <div className="modal">
                        <div className="modalContent">
                            <Read id={selectedPost} handleCloseModal={handleCloseModal} />
                        </div>
                    </div>
                )}

                {writeOpen && (
                    <div className="modal">
                        <div className="modalContent">
                            <Write handleCloseWrite={handleCloseWrite} />
                        </div>
                    </div>
                )}


            </div>
        </>
    );
}

export default List;