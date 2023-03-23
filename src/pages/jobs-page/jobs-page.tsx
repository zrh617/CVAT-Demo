import './styles.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/lib/spin';
import { Col, Row } from 'antd/lib/grid';
import Pagination from 'antd/lib/pagination';
import Empty from 'antd/lib/empty';
import Text from 'antd/lib/typography/Text';

import FeedbackComponent from '@/components/feedback/feedback';
import { updateHistoryFromQuery } from '@/components/resource-sorting-filtering';
import { CombinedState, Indexable } from '@/reducers';
import { getJobsAsync } from '@/actions/jobs-actions';

import TopBarComponent from './top-bar';
import JobsContentComponent from './jobs-content';
import { A } from 'svg.js';

function JobsPageComponent(): JSX.Element {
    const dispatch = useDispatch();
    const history: any = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const query = useSelector((state: CombinedState) => state.jobs.query);
    const fetching = useSelector((state: CombinedState) => state.jobs.fetching);
    const count = useSelector((state: CombinedState) => state.jobs.count);

    const queryParams = new URLSearchParams(history.location?.search);
    const updatedQuery = { ...query };
    for (const key of Object.keys(updatedQuery)) {
        (updatedQuery as Indexable)[key] = queryParams.get(key) || null;
        if (key === 'page') {
            updatedQuery.page = updatedQuery.page ? +updatedQuery.page : 1;
        }
    }

    useEffect(() => {
        dispatch(getJobsAsync({ ...updatedQuery }) as any);
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            history.replace({
                search: updateHistoryFromQuery(query),
            });
        }
    }, [query]);

    const content = count ? (
        <>
            <JobsContentComponent />
            <Row justify='space-around' about='middle'>
                <Col md={22} lg={18} xl={16} xxl={16}>
                    <Pagination
                        className='cvat-jobs-page-pagination'
                        onChange={(page: number) => {
                            dispatch(getJobsAsync({
                                ...query,
                                page,
                            }) as any);
                        }}
                        showSizeChanger={false}
                        total={count}
                        pageSize={12}
                        current={query.page}
                        showQuickJumper
                    />
                </Col>
            </Row>
        </>
    ) : <Empty description={<Text>No results matched your search...</Text>} />;

    return (
        <div className='cvat-jobs-page'>
            <TopBarComponent
                query={updatedQuery}
                onApplySearch={(search: string | null) => {
                    dispatch(
                        getJobsAsync({
                            ...query,
                            search,
                            page: 1,
                        }) as any,
                    );
                }}
                onApplyFilter={(filter: string | null) => {
                    dispatch(
                        getJobsAsync({
                            ...query,
                            filter,
                            page: 1,
                        }) as any,
                    );
                }}
                onApplySorting={(sorting: string | null) => {
                    dispatch(
                        getJobsAsync({
                            ...query,
                            sort: sorting,
                            page: 1,
                        }) as any,
                    );
                }}
            />
            { fetching ? (
                <Spin size='large' className='cvat-spinner' />
            ) : content }
            <FeedbackComponent />
        </div>
    );
}

export default React.memo(JobsPageComponent);