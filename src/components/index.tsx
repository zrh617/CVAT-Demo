import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import {
    // RouteComponentProps,
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom';
import { Col, Row } from 'antd/lib/grid';
import Layout from 'antd/lib/layout';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';
import Spin from 'antd/lib/spin';
import Text from 'antd/lib/typography/Text';
// import 'antd/dist/antd.css';

// import LogoutComponent from 'components/logout-component';
// import LoginPageContainer from 'containers/login-page/login-page';
// import LoginWithTokenComponent from 'components/login-with-token/login-with-token';
// import RegisterPageContainer from 'containers/register-page/register-page';
// import ResetPasswordPageConfirmComponent from 'components/reset-password-confirm-page/reset-password-confirm-page';
// import ResetPasswordPageComponent from 'components/reset-password-page/reset-password-page';

// import Header from 'components/header/header';
// import GlobalErrorBoundary from 'components/global-error-boundary/global-error-boundary';

// import ShortcutsDialog from 'components/shortcuts-dialog/shortcuts-dialog';
// import ExportDatasetModal from 'components/export-dataset/export-dataset-modal';
// import ExportBackupModal from 'components/export-backup/export-backup-modal';
// import ImportDatasetModal from 'components/import-dataset/import-dataset-modal';
// import ImportBackupModal from 'components/import-backup/import-backup-modal';
// import ModelsPageContainer from 'containers/models-page/models-page';

// import JobsPageComponent from 'components/jobs-page/jobs-page';

// import TasksPageContainer from 'containers/tasks-page/tasks-page';
// import CreateTaskPageContainer from 'containers/create-task-page/create-task-page';
// import TaskPageContainer from 'containers/task-page/task-page';

import ProjectsPageComponent from '@/components/project-page/project-page';
// import ProjectsPageComponent from 'components/projects-page/projects-page';
// import CreateProjectPageComponent from 'components/create-project-page/create-project-page';
// import ProjectPageComponent from 'components/project-page/project-page';

// import CloudStoragesPageComponent from 'components/cloud-storages-page/cloud-storages-page';
// import CreateCloudStoragePageComponent from 'components/create-cloud-storage-page/create-cloud-storage-page';
// import UpdateCloudStoragePageComponent from 'components/update-cloud-storage-page/update-cloud-storage-page';

// import OrganizationPage from 'components/organization-page/organization-page';
// import CreateOrganizationComponent from 'components/create-organization-page/create-organization-page';
// import { ShortcutsContextProvider } from 'components/shortcuts.context';

// import WebhooksPage from 'components/webhooks-page/webhooks-page';
// import CreateWebhookPage from 'components/setup-webhook-pages/create-webhook-page';
// import UpdateWebhookPage from 'components/setup-webhook-pages/update-webhook-page';

// import AnnotationPageContainer from 'containers/annotation-page/annotation-page';
// import { getCore } from 'cvat-core-wrapper';
// import GlobalHotKeys, { KeyMap } from 'utils/mousetrap-react';
// import { NotificationsState } from 'reducers';
// import { customWaViewHit } from 'utils/enviroment';
// import showPlatformNotification, {
//     platformInfo,
//     stopNotifications,
//     showUnsupportedNotification,
// } from 'utils/platform-checker';
// import '../styles.scss';
// import EmailConfirmationPage from './email-confirmation-pages/email-confirmed';
// import EmailVerificationSentPage from './email-confirmation-pages/email-verification-sent';
// import IncorrectEmailConfirmationPage from './email-confirmation-pages/incorrect-email-confirmation';

interface CVATAppProps {
    loadFormats: () => void;
    loadAbout: () => void;
    verifyAuthorized: () => void;
    loadUserAgreements: () => void;
    initPlugins: () => void;
    initModels: () => void;
    resetErrors: () => void;
    resetMessages: () => void;
    switchShortcutsDialog: () => void;
    switchSettingsDialog: () => void;
    loadAuthActions: () => void;
    loadOrganizations: () => void;
    // keyMap: KeyMap;
    userInitialized: boolean;
    userFetching: boolean;
    organizationsFetching: boolean;
    organizationsInitialized: boolean;
    pluginsInitialized: boolean;
    pluginsFetching: boolean;
    modelsInitialized: boolean;
    modelsFetching: boolean;
    formatsInitialized: boolean;
    formatsFetching: boolean;
    aboutInitialized: boolean;
    aboutFetching: boolean;
    userAgreementsFetching: boolean;
    userAgreementsInitialized: boolean;
    authActionsFetching: boolean;
    authActionsInitialized: boolean;
    // notifications: NotificationsState;
    user: any;
    isModelPluginActive: boolean;
}

function withRouter(Component: JSX.IntrinsicAttributes | any) {
    function ComponentWithRouterProp(props: JSX.IntrinsicAttributes) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

class CVATApplication extends React.PureComponent<CVATAppProps> {
    public componentDidMount(): void {
        // const core = getCore();
        // const { verifyAuthorized } = this.props;
        // configure({ ignoreRepeatedEventsWhenKeyHeldDown: false });

        // Logger configuration
        const userActivityCallback: (() => void)[] = [];
        window.addEventListener('click', () => {
            userActivityCallback.forEach((handler) => handler());
        });
        // core.logger.configure(() => window.document.hasFocus, userActivityCallback);

        // customWaViewHit(location.pathname, location.search, location.hash);
        // history.listen((_location) => {
        //     customWaViewHit(_location.pathname, _location.search, _location.hash);
        // });

        // verifyAuthorized();

        // const {
        //     name, version, engine, os,
        // } = platformInfo();

        // if (showPlatformNotification()) {
        //     stopNotifications(false);
        //     Modal.warning({
        //         title: 'Unsupported platform detected',
        //         className: 'cvat-modal-unsupported-platform-warning',
        //         content: (
        //             <>
        //                 <Row>
        //                     <Col>
        //                         <Text>
        //                             {`The browser you are using is ${name} ${version} based on ${engine}.` +
        //                                 ' CVAT was tested in the latest versions of Chrome and Firefox.' +
        //                                 ' We recommend to use Chrome (or another Chromium based browser)'}
        //                         </Text>
        //                     </Col>
        //                 </Row>
        //                 <Row>
        //                     <Col>
        //                         <Text type='secondary'>{`The operating system is ${os}`}</Text>
        //                     </Col>
        //                 </Row>
        //             </>
        //         ),
        //         onOk: () => stopNotifications(true),
        //     });
        // } else if (showUnsupportedNotification()) {
        //     stopNotifications(false);
        //     Modal.warning({
        //         title: 'Unsupported features detected',
        //         className: 'cvat-modal-unsupported-features-warning',
        //         content: (
        //             <Text>
        //                 {`${name} v${version} does not support API, which is used by CVAT. `}
        //                 It is strongly recommended to update your browser.
        //             </Text>
        //         ),
        //         onOk: () => stopNotifications(true),
        //     });
        // }
    }

    public componentDidUpdate(): void {
        const {
            verifyAuthorized,
            loadFormats,
            loadAbout,
            loadUserAgreements,
            initPlugins,
            initModels,
            loadOrganizations,
            loadAuthActions,
            userInitialized,
            userFetching,
            organizationsFetching,
            organizationsInitialized,
            formatsInitialized,
            formatsFetching,
            aboutInitialized,
            aboutFetching,
            pluginsInitialized,
            pluginsFetching,
            modelsInitialized,
            modelsFetching,
            user,
            userAgreementsFetching,
            userAgreementsInitialized,
            authActionsFetching,
            authActionsInitialized,
            isModelPluginActive,
        } = this.props;

        this.showErrors();
        this.showMessages();

        if (!userInitialized && !userFetching) {
            // verifyAuthorized();
            return;
        }

        if (!userAgreementsInitialized && !userAgreementsFetching) {
            loadUserAgreements();
            return;
        }

        if (!authActionsInitialized && !authActionsFetching) {
            loadAuthActions();
        }

        if (user == null || !user.isVerified) {
            return;
        }

        if (!organizationsInitialized && !organizationsFetching) {
            loadOrganizations();
        }

        if (!formatsInitialized && !formatsFetching) {
            loadFormats();
        }

        if (!aboutInitialized && !aboutFetching) {
            loadAbout();
        }

        if (isModelPluginActive && !modelsInitialized && !modelsFetching) {
            initModels();
        }

        if (!pluginsInitialized && !pluginsFetching) {
            initPlugins();
        }
    }

    private showMessages(): void {
        function showMessage(title: string): void {
            notification.info({
                message: (
                    <div
                        // eslint-disable-next-line
                        dangerouslySetInnerHTML={{
                            __html: title,
                        }}
                    />
                ),
                duration: null,
            });
        }

        const { resetMessages } = this.props;

        let shown = false;
        // for (const where of Object.keys(notifications.messages)) {
        //     for (const what of Object.keys((notifications as any).messages[where])) {
        //         const message = (notifications as any).messages[where][what];
        //         shown = shown || !!message;
        //         if (message) {
        //             showMessage(message);
        //         }
        //     }
        // }

        if (shown) {
            resetMessages();
        }
    }

    private showErrors(): void {
        function showError(title: string, _error: any, className?: string): void {
            const error = _error.toString();
            const dynamicProps = typeof className === 'undefined' ? {} : { className };
            notification.error({
                ...dynamicProps,
                message: (
                    <div
                        // eslint-disable-next-line
                        dangerouslySetInnerHTML={{
                            __html: title,
                        }}
                    />
                ),
                duration: null,
                description: error.length > 200 ? 'Open the Browser Console to get details' : error,
            });

            // eslint-disable-next-line no-console
            console.error(error);
        }

        const { resetErrors } = this.props;

        let shown = false;
        // for (const where of Object.keys(notifications.errors)) {
        //     for (const what of Object.keys((notifications as any).errors[where])) {
        //         const error = (notifications as any).errors[where][what];
        //         shown = shown || !!error;
        //         if (error) {
        //             showError(error.message, error.reason, error.className);
        //         }
        //     }
        // }

        if (shown) {
            resetErrors();
        }
    }

    // Where you go depends on your URL
    public render(): JSX.Element {
        const {
            userInitialized,
            aboutInitialized,
            pluginsInitialized,
            formatsInitialized,
            modelsInitialized,
            organizationsInitialized,
            userAgreementsInitialized,
            authActionsInitialized,
            switchShortcutsDialog,
            switchSettingsDialog,
            user,
            // keyMap,
            // location,
            isModelPluginActive,
        } = this.props;

        const notRegisteredUserInitialized = (userInitialized && (user == null || !user.isVerified));
        let readyForRender = userAgreementsInitialized && authActionsInitialized;
        readyForRender = readyForRender && (notRegisteredUserInitialized ||
            (
                userInitialized &&
                formatsInitialized &&
                pluginsInitialized &&
                aboutInitialized &&
                organizationsInitialized &&
                (!isModelPluginActive || modelsInitialized)
            )
        );

        // const subKeyMap = {
        //     SWITCH_SHORTCUTS: keyMap.SWITCH_SHORTCUTS,
        //     SWITCH_SETTINGS: keyMap.SWITCH_SETTINGS,
        // };

        const handlers = {
            SWITCH_SHORTCUTS: (event: KeyboardEvent) => {
                if (event) event.preventDefault();

                switchShortcutsDialog();
            },
            SWITCH_SETTINGS: (event: KeyboardEvent) => {
                if (event) event.preventDefault();

                switchSettingsDialog();
            },
        };

        console.log(readyForRender, 'readyForRender');

        // if (readyForRender) {
            // if (user && user.isVerified) {
                return (
                    // <GlobalErrorBoundary>
                    // {/* <ShortcutsContextProvider> */}
                    <Layout>
                        {/* <Header /> */}
                        <Layout.Content style={{ height: '100%', backgroundColor: 'red' }}>
                            {/* <ShortcutsDialog /> */}
                            {/* <GlobalHotKeys keyMap={subKeyMap} handlers={handlers}> */}
                            <Routes>
                                {/* <Route exact path='/auth/logout' component={LogoutComponent} /> */}
                                <Route path='/projects' element={<ProjectsPageComponent />} />
                                {/* <Route exact path='/projects/create' component={CreateProjectPageComponent} />
                                            <Route exact path='/projects/:id' component={ProjectPageComponent} />
                                            <Route exact path='/projects/:id/webhooks' component={WebhooksPage} />
                                            <Route exact path='/tasks' component={TasksPageContainer} />
                                            <Route exact path='/tasks/create' component={CreateTaskPageContainer} />
                                            <Route exact path='/tasks/:id' component={TaskPageContainer} />
                                            <Route exact path='/tasks/:tid/jobs/:jid' component={AnnotationPageContainer} />
                                            <Route exact path='/jobs' component={JobsPageComponent} />
                                            <Route exact path='/cloudstorages' component={CloudStoragesPageComponent} />
                                            <Route
                                                exact
                                                path='/cloudstorages/create'
                                                component={CreateCloudStoragePageComponent}
                                            />
                                            <Route
                                                exact
                                                path='/cloudstorages/update/:id'
                                                component={UpdateCloudStoragePageComponent}
                                            />
                                            <Route
                                                exact
                                                path='/organizations/create'
                                                component={CreateOrganizationComponent}
                                            />
                                            <Route exact path='/organization/webhooks' component={WebhooksPage} />
                                            <Route exact path='/webhooks/create' component={CreateWebhookPage} />
                                            <Route exact path='/webhooks/update/:id' component={UpdateWebhookPage} />
                                            <Route exact path='/organization' component={OrganizationPage} />
                                            {isModelPluginActive && (
                                                <Route exact path='/models' component={ModelsPageContainer} />
                                            )} */}
                                {/* <Navigate
                                    push
                                    to={new URLSearchParams(location.search).get('next') || '/tasks'}
                                /> */}
                            </Routes>
                            {/* </GlobalHotKeys> */}
                            {/* eslint-disable-next-line */}
                            {/* <ExportDatasetModal /> */}
                            {/* <ExportBackupModal /> */}
                            {/* <ImportDatasetModal /> */}
                            {/* <ImportBackupModal /> */}
                            {/* eslint-disable-next-line */}
                            <a id='downloadAnchor' target='_blank' style={{ display: 'none' }} download />
                        </Layout.Content>
                    </Layout>
                    // </ShortcutsContextProvider>
                    // </GlobalErrorBoundary>
                );
            // }

            // return (
            //     // <GlobalErrorBoundary>
            //     <Routes>
            //         {/* <Route exact path='/auth/register' component={RegisterPageContainer} />
            //             <Route exact path='/auth/email-verification-sent' component={EmailVerificationSentPage} />
            //             <Route exact path='/auth/incorrect-email-confirmation' component={IncorrectEmailConfirmationPage} />
            //             <Route exact path='/auth/login' component={LoginPageContainer} />
            //             <Route
            //                 exact
            //                 path='/auth/login-with-token/:sessionId/:token'
            //                 component={LoginWithTokenComponent}
            //             />
            //             <Route exact path='/auth/password/reset' component={ResetPasswordPageComponent} />
            //             <Route
            //                 exact
            //                 path='/auth/password/reset/confirm'
            //                 component={ResetPasswordPageConfirmComponent}
            //             /> */}

            //         {/* <Route exact path='/auth/email-confirmation' component={EmailConfirmationPage} /> */}

            //         <Navigate
            //             to={location.pathname.length > 1 ? `/auth/login?next=${location.pathname}` : '/auth/login'}
            //         />
            //     </Routes>
            //     // </GlobalErrorBoundary>
            // );
        // }

        return <Spin size='large' className='cvat-spinner' />;
    }
}

export default withRouter(CVATApplication);
