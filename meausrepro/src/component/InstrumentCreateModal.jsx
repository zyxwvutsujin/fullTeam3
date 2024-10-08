import axios from "axios";
import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";

function InstrumentCreateModal(props) {
    const { project, section, InsgeometryData, isOpen, closeModal } = props;

    const dateNow = new Date();
    const today = dateNow.toISOString().slice(0, 10);

    // 특정 프로젝트
    const [projectList, setProjectList] = useState([]);
    // 특정 구간
    const [sectionList, setSectionList] = useState([]);

    // 입력 필드 상태 관리
    const [insType, setInsType] = useState('A');    // 'A' : 지하수위계
    const [insNum, setInsNum] = useState('');
    const [insName, setInsName] = useState('');
    const [insNo, setInsNo] = useState('');
    const [createDate, setCreateDate] = useState(today);
    const [insLocation, setInsLocation] = useState('');
    const [measurement1, setMeasurement1] = useState(null);
    const [measurement2, setMeasurement2] = useState(null);
    const [measurement3, setMeasurement3] = useState(null);
    const [verticalPlus, setVerticalPlus] = useState(null);
    const [verticalMinus, setVerticalMinus] = useState(null);

    // 계측기 생성
    const handleCreateInstrument = async () => {
        const wkt = `POLYGON((${InsgeometryData.map(coord => `${coord[1]} ${coord[0]}`).join(', ')}))`;
        axios.post(`http://localhost:8080/MeausrePro/Instrument/save`, {
            projectId: project,
            sectionId: section,
            insType: insType,
            insNum: insNum,
            insName: insName,
            insNo: insNo,
            insGeometry: wkt,
            createDate: createDate,
            insLocation: insLocation,
            measurement1: measurement1,
            measurement2: measurement2,
            measurement3: measurement3,
            verticalPlus: verticalPlus,
            verticalMinus: verticalMinus
        })
            .then(res => {
                if (!insType || !insNum || !insName || !insNo || !createDate || !insLocation || !measurement1 || !measurement2 || !measurement3 || !verticalPlus || !verticalMinus) {
                    alert("모든 필드를 입력해주세요.");
                    return;
                }
                else {
                    console.log(res);
                    handleCloseModal();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        if (isOpen) {
            // 특정 프로젝트 보기
            axios
                .get('http://localhost:8080/MeausrePro/Section/${projectId}')
                .then((res) => {
                    const {data} = res;
                    setProjectList(data);
                })
                .catch((err) => {
                    console.log(err);
                });

            // 특정 구간 보기
            axios
                .get(`http://localhost:8080/MeausrePro/Instrument/${sectionId}`)
                .then((res) => {
                    console.log(res);
                    const {data} = res;
                    setSectionList(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [isOpen, section]);

    // 모달 닫기
    const handleCloseModal = () => {
        setInsType('A');
        setInsNum('');
        setInsName('');
        setInsNo('');
        setCreateDate('');
        setInsLocation('');
        setMeasurement1('');
        setMeasurement2('');
        setMeasurement3('');
        setVerticalPlus('');
        setVerticalMinus('');
        closeModal();
    };

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id={'createInstrument'}
            tabIndex={'-1'}
            aria-labelledby={'cpModalLabel'}
            aria-hidden={!isOpen}
            style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <span className={'fs-4 modal-title'} id={'cpModalLabel'}>
                            계측기 기본정보
                        </span>
                        <button type={'button'}
                                className={'btn-close'}
                                data-bs-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={handleCloseModal}
                        />
                    </div>
                    <div className={'modal-body'}>
                        <div className={'d-flex flex-column'}>
                            <div className={'d-flex align-items-center'}>
                                <span className={'text-danger'}>*</span>
                                <label htmlFor={'section'} className={'form-label'}>
                                    현장명 :
                                </label>
                            </div>
                            <div className={'d-flex align-items-center'}>
                                {projectList.map((item) => {
                                    return (
                                        <div key={item.idx}>
                                            <span>{item.siteName}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={'d-flex align-items-center'}>
                                <span className={'text-danger'}>*</span>
                                <label htmlFor={'section'} className={'form-label'}>
                                    구간명 :
                                </label>
                            </div>
                            <div className={'d-flex align-items-center'}>
                                {sectionList.map((item) => {
                                    return (
                                        <div key={item.idx}>
                                            <span>{item.sectionName}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'insType'} className={'form-label'}>
                                            계측기 종류:
                                        </label>
                                        <select className={'form-select'} id={'insType'}>
                                            <option value={''} selected>구간내계측기종류선택</option>
                                            <option value={insType === 'A'}>지중경사계</option>
                                            <option value={insType === 'B'}>지하수위계</option>
                                            <option value={insType === 'C'}>간극수압계</option>
                                            <option value={insType === 'D'}>지표침하계</option>
                                            <option value={insType === 'E'}>하중계_버팀대</option>
                                            <option value={insType === 'F'}>하중계_PSBEAM</option>
                                            <option value={insType === 'G'}>하중계_앵커</option>
                                            <option value={insType === 'H'}>변형률계(버팀대)</option>
                                            <option value={insType === 'I'}>구조물기울기계</option>
                                            <option value={insType === 'J'}>균열측정계</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'endDate'} className={'form-label'}>
                                            종료일자
                                        </label>
                                    </div>
                                    <input type={'date'}
                                           className={'form-control'}
                                           id={'endDate'}
                                           value={endDate}
                                           min={startDate}
                                           onChange={(e) => setEndDate(e.target.value)}
                                           placeholder={'종료일자를 입력하세요'}/>
                                </div>
                            </div>

                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'startDate'} className={'form-label'}>
                                            시작일자
                                        </label>
                                    </div>
                                    <input
                                        type={'date'}
                                        id={'startDate'}
                                        className={'form-control'}
                                        value={startDate}
                                        min={today}
                                        onChange={(e) => setStartDate(e.target.value)}/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'endDate'} className={'form-label'}>
                                            종료일자
                                        </label>
                                    </div>
                                    <input type={'date'}
                                           className={'form-control'}
                                           id={'endDate'}
                                           value={endDate}
                                           min={startDate}
                                           onChange={(e) => setEndDate(e.target.value)}
                                           placeholder={'종료일자를 입력하세요'}/>
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'contractor'} className={'form-label'}>
                                            시공사
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'contractor'} value={contractor}
                                           onChange={(e) => setContractor(e.target.value)}
                                           placeholder={'시공사를 입력하세요'}/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'measurer'} className={'form-label'}>
                                            계측사
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'measurer'}
                                           placeholder={'계측사를 입력하세요'} value={measurer}
                                           onChange={(e) => setMeasurer(e.target.value)}/>
                                </div>
                            </div>
                            <div className={'d-flex align-items-center mt-2'}>
                                <span className={'text-danger'}>*</span>
                                <label className={'form-label'}>
                                    종료여부
                                </label>
                            </div>
                            <div className={'d-flex gap-2'}>
                                <div className={'form-check form-check-inline'}>
                                    <input className={'form-check-input'} type={'radio'} name={'status'}
                                           id={'going'}
                                           checked={status === 'N'}
                                           onChange={() => setStatus('N')}/>
                                    <label className={'form-check-label'} htmlFor={'going'}>진행</label>
                                </div>
                                <div className={'form-check form-check-inline'}>
                                    <input className={'form-check-input'} type={'radio'} name={'status'}
                                           id={'finish'}
                                           checked={status === 'Y'}
                                           onChange={() => setStatus('Y')}/>
                                    <label className={'form-check-label'} htmlFor={'finish'}>종료</label>
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'geometryInfo'} className={'form-label'}>
                                            지오매트리정보
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'geometryInfo'}
                                           placeholder={'지오매트리정보를 입력하세요'} value={geometryData} readOnly/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'workGroup'} className={'form-label'}>
                                        작업그룹
                                    </label>
                                    <select className={'form-select'} id={'workGroup'}>
                                        <option value={''} selected>선택하세요</option>
                                        <option value={'group1'}>그룹 1</option>
                                        <option value={'group2'}>그룹 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={'modal-footer'}>
                            <button type={'button'}
                                    className={'btn btn-outline-dark opacity-50'}
                                    data-bs-dismiss={'modal'}
                                    onClick={handleCloseModal}
                            >
                                Close
                            </button>
                            <button type={'button'}
                                    className={'btn btn-success opacity-50'} onClick={handleCreateInstrument}
                            >
                                프로젝트 생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstrumentCreateModal;