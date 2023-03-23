import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function withRouter(Component: JSX.IntrinsicAttributes | any) {
    function ComponentWithRouterProp(props: JSX.IntrinsicAttributes | any) {
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