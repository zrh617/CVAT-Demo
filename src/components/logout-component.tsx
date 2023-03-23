import Spin from 'antd/lib/spin';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveLogsAsync } from '@/actions/annotation-actions';
import { logoutAsync } from '@/actions/auth-actions';
import { useNavigate } from 'react-router-dom';

function LogoutComponent(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(saveLogsAsync() as any).then(() => {
            dispatch(logoutAsync() as any).then(() => {
                navigate('');
            });
        });
    }, []);

    return (
        <div className='cvat-logout-page cvat-spinner-container'>
            <Spin className='cvat-spinner' />
        </div>
    );
}

export default React.memo(LogoutComponent);