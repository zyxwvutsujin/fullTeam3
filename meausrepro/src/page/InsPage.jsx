import CustomSidebar from "../component/sidebar/CustomSidebar.jsx";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import UserContext from "../context/UserContext.jsx";
import {Line} from "react-chartjs-2";
import 'chart.js/auto';

const InsPage = () => {
    const { id } = useParams(); // url에서 계측기 id 가져옴
    const { user } = useContext(UserContext);
    const [instrument, setInstrument] = useState(null);
    const [measurements, setMeasurements] = useState([]); // 측정 데이터 상태 추가
    const [managementTypes, setManagementTypes] = useState([]); // 측정 데이터 추가 값

    useEffect(() => {
        // 계측기 정보 가져오기
        axios.get(`http://localhost:8080/MeausrePro/Instrument/details/${id}`)
            .then(response => {
                console.log("계측기 정보:", response.data);
                if (response.data.length > 0) {
                    const detailedInstrument = response.data[0];
                    setInstrument(detailedInstrument); // 상태 업데이트
                }
            })
            .catch(err => {
                console.error("계측기 정보 조회 중 오류 발생", err);
            });
    }, [id]);

    useEffect(() => {
        // 관리 정보 가져오기
        axios.get(`http://localhost:8080/MeausrePro/Management/details/${id}`)
            .then(response => {
                console.log("측정 데이터 응답:", response.data);
                if (response.data.length > 0) {
                    setMeasurements(response.data.map(item => item.management)); // 관리 정보를 리스트로 상태에 설정
                    setManagementTypes(response.data.map(item => item.managementType)); // 추가 정보도 리스트로 설정
                }
            })
            .catch(err => {
                console.error("측정 데이터 조회 중 오류 발생", err.response ? err.response.data : err);
            });
    }, [id]);


    // 차트
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const data = {
        labels: measurements.map(measurement => measurement.createDate),
        datasets: [
            {
                label: instrument.instrId.insNum,
                data: managementTypes.map(type => type.gage1),
                borderColor: '#5470c6',
                fill: false,
            },
            {
                label: '1차 기준',
                data: managementTypes.map(type => type.gage1),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: '2차 기준',
                data: managementTypes.map(type => type.gage2),
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            },
            {
                label: 'Gage3',
                data: managementTypes.map(type => type.gage3),
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false,
            },
        ],
    };

    return (
        <div className='d-flex vh-100'>
            <CustomSidebar topManager={user.topManager} />
            {instrument ? (
                <div>
                    <h2>{instrument.instrId?.insName || '계측기 이름이 없습니다.'} 상세 정보</h2>
                    <h3>기초 자료 정보</h3>
                    <table className='table table-bordered'>
                        <tbody>
                        <tr>
                            <th>현장명</th>
                            <td>{instrument.instrId?.sectionId?.sectionName}</td>
                        </tr>
                        <tr>
                            <th>관리번호</th>
                            <td>{instrument.instrId?.insNum}</td>
                        </tr>
                        <tr>
                            <th>계측기명</th>
                            <td>{instrument.instrId?.insName}</td>
                        </tr>
                        <tr>
                            <th>설치 위치</th>
                            <td>{instrument.instrId?.insLocation}</td>
                        </tr>
                        <tr>
                            <th>시리얼 NO</th>
                            <td>{instrument.instrId?.insNo}</td>
                        </tr>
                        <tr>
                            <th>설치일자</th>
                            <td>{instrument.instrId?.createDate}</td>
                        </tr>
                        <tr>
                            <th>계측기 종류</th>
                            <td>{instrument.instrId?.insType}</td>
                        </tr>
                        {/* 각 계측기 타입에 따른 추가 정보 */}
                        {instrument.instrId?.insType === 'B' && (
                            <tr>
                                <th>허용인장력</th>
                                <td>{instrument.tenAllowable}</td>
                            </tr>
                        )}
                        {instrument.instrId?.insType === 'C' && (
                            <>
                                <tr>
                                    <th>설계긴장력</th>
                                    <td>{instrument.tenDesign}</td>
                                </tr>
                                <tr>
                                    <th>ZERO READ</th>
                                    <td>{instrument.zeroRead}</td>
                                </tr>
                            </>
                        )}
                        {instrument.instrId?.insType === 'D' && (
                            <>
                                <tr>
                                    <th>1차관리기준</th>
                                    <td>{instrument.instrId?.measurement1}</td>
                                </tr>
                                <tr>
                                    <th>2차관리기준</th>
                                    <td>{instrument.instrId?.measurement2}</td>
                                </tr>
                            </>
                        )}
                        {instrument.instrId?.insType === 'E' && (
                            <>
                                <tr>
                                    <th>A(+)</th>
                                    <td>현장 방향</td>
                                    <td>{instrument.aPlus}</td>
                                </tr>
                                <tr>
                                    <th>A(-)</th>
                                    <td>배면 방향</td>
                                    <td>{instrument.aPlus}</td>
                                </tr>
                                <tr>
                                    <th>B(+)</th>
                                    <td>현장우측 방향</td>
                                    <td>{instrument.aPlus}</td>
                                </tr>
                                <tr>
                                    <th>B(-)</th>
                                    <td>배면우측 방향</td>
                                    <td>{instrument.aPlus}</td>
                                </tr>
                                <tr>
                                    <th>관리기준</th>
                                    <td>1차 : {instrument.instrId?.measurement1}</td>
                                    <td>2차 : {instrument.instrId?.measurement2}</td>
                                    <td>3차 : {instrument.instrId?.measurement3}</td>
                                </tr>
                            </>
                        )}
                        </tbody>
                    </table>

                    <h3>측정 데이터</h3>
                    <table className='table table-bordered'>
                        <thead>
                        <tr>
                            <th>측정일</th>
                            <th>Gage1</th>
                            {instrument.instrId?.insType !== 'D' && <th>Gage2</th>}
                            {instrument.instrId?.insType !== 'D' && <th>Gage3</th>}
                            {instrument.instrId?.insType === 'E' && <th>Gage4</th>}
                            {instrument.instrId?.insType === 'F' && <th>Crack Width</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {measurements && measurements.length > 0 ? (
                            measurements.map((measurement, index) => (
                                <tr key={index}>
                                    <td>{measurement.createDate}</td>
                                    <td>{managementTypes[index]?.gage1}</td>
                                    {instrument.instrId?.insType !== 'D' &&
                                        <td>{managementTypes[index]?.gage2}</td>}
                                    {instrument.instrId?.insType !== 'D' &&
                                        <td>{managementTypes[index]?.gage3}</td>}
                                    {instrument.instrId?.insType === 'E' &&
                                        <td>{managementTypes[index]?.gage4}</td>}
                                    {instrument.instrId?.insType === 'F' &&
                                        <td>{measurement.crackWidth}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">측정 데이터가 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <h3>차트</h3>
                    <Line data={data} options={options} />
                </div>
            ) : (
                <h2>계측기 정보가 없습니다.</h2>
            )}
        </div>
    );
}

export default InsPage;
