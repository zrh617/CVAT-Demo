import React, { useEffect } from 'react';
import { Row, Col } from 'antd/lib/grid';

import SigningLayout, { formSizes } from '@/components/signing-common/signing-layout';
import SocialAccountLink from '@/components/signing-common/social-account-link';
import { SocialGithubLogo, SocialGoogleLogo } from '@/icons';
import LoginForm, { LoginData } from './login-form';
import { getCore } from '@/core-wrapper';
import { useNavigate } from 'react-router-dom';
import { withRouter } from '@/utils/withRouter';

const cvat = getCore();

interface LoginPageComponentProps {
    fetching: boolean;
    renderResetPassword: boolean;
    hasEmailVerificationBeenSent: boolean;
    googleAuthentication: boolean;
    githubAuthentication: boolean;
    onLogin: (credential: string, password: string) => void;
    loadAdvancedAuthenticationMethods: () => void;
}

function LoginPageComponent(props: LoginPageComponentProps): JSX.Element {
    const navigate = useNavigate();
    const { backendAPI } = cvat.config;
    const {
        fetching, renderResetPassword, hasEmailVerificationBeenSent,
        googleAuthentication, githubAuthentication, onLogin, loadAdvancedAuthenticationMethods,
    } = props;

    if (hasEmailVerificationBeenSent) {
        navigate('/auth/email-verification-sent');
    }

    useEffect(() => {
        loadAdvancedAuthenticationMethods();
    }, []);

    return (
        <SigningLayout>
            <Col {...formSizes.wrapper}>
                <Row justify='center'>
                    <Col {...formSizes.form}>
                        <LoginForm
                            fetching={fetching}
                            renderResetPassword={renderResetPassword}
                            socialAuthentication={(googleAuthentication || githubAuthentication) ? (
                                <div className='cvat-social-authentication'>
                                    {githubAuthentication && (
                                        <SocialAccountLink
                                            icon={SocialGithubLogo}
                                            href={`${backendAPI}/auth/github/login`}
                                            className='cvat-social-authentication-github'
                                        >
                                            Continue with GitHub
                                        </SocialAccountLink>
                                    )}
                                    {googleAuthentication && (
                                        <SocialAccountLink
                                            icon={SocialGoogleLogo}
                                            href={`${backendAPI}/auth/google/login`}
                                            className='cvat-social-authentication-google'
                                        >
                                            Continue with Google
                                        </SocialAccountLink>
                                    )}
                                </div>
                            ) : null}
                            onSubmit={(loginData: LoginData): void => {
                                onLogin(loginData.credential, loginData.password);
                            }}
                        />
                    </Col>
                </Row>
            </Col>
        </SigningLayout>
    );
}

export default withRouter(LoginPageComponent);
