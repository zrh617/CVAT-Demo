import React from 'react';
import { Row, Col } from 'antd/lib/grid';

import { UserAgreement } from 'reducers';
import SigningLayout, { formSizes } from '@/components/signing-common/signing-layout';
import RegisterForm, { RegisterData, UserConfirmation } from './register-form';
import { withRouter } from '@/utils/withRouter';

interface RegisterPageComponentProps {
    fetching: boolean;
    userAgreements: UserAgreement[];
    onRegister: (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmations: UserConfirmation[],
    ) => void;
}

function RegisterPageComponent(props: RegisterPageComponentProps): JSX.Element {
    const { fetching, userAgreements, onRegister } = props;

    return (
        <SigningLayout>
            <Col {...formSizes.wrapper}>
                <Row justify='center'>
                    <Col {...formSizes.form}>
                        <RegisterForm
                            fetching={fetching}
                            userAgreements={userAgreements}
                            onSubmit={(registerData: RegisterData): void => {
                                onRegister(
                                    registerData.username,
                                    registerData.firstName,
                                    registerData.lastName,
                                    registerData.email,
                                    registerData.password,
                                    registerData.confirmations,
                                );
                            }}
                        />
                    </Col>
                </Row>
            </Col>
        </SigningLayout>
    );
}

export default withRouter(RegisterPageComponent);
