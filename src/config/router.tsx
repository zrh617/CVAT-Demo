import { RouteObject } from "react-router-dom";
import LazyWrapper from "@/components/lazy-wrapper";
const ROUTER_CONFIG: RouteObject[] = [
  {
    path: "/",
    element: <LazyWrapper path="/home" />,
  },
  {
    path: "/main",
    element: <LazyWrapper path="/main-page/index" />
  },
  {
    path: "/auth/login",
    element: <LazyWrapper path="/login-page/login-page" />,
  },
  {
    path: "/auth/incorrect-email-confirmation",
    element: <LazyWrapper path="/email-confirmation-pages/incorrect-email-confirmation" />,
  },
  // {
  //   path: "/projects",
  //   element: <LazyWrapper path="/project-page" />,
  // },
  {
    path: "/projects/:id",
    element: <LazyWrapper path="/project-page" />,
  },
  {
    path: "/projects/create",
    element: <LazyWrapper path="/create-project-page/create-project-page" />,
  },
  {
    path: "/tasks",
    element: <LazyWrapper path="/tasks-page/tasks-page" />,
  },
  {
    path: "/tasks/:id",
    element: <LazyWrapper path="/tasks-page/tasks-page" />,
  },
  {
    path: "/jobs",
    element: <LazyWrapper path="/jobs-page/jobs-page" />,
  },
  {
    path: "/tasks/:tid/jobs/:jid",
    element: <LazyWrapper path="/annotation-page/annotation-page" />,
  },
  {
    path: "/webhooks-page",
    element: <LazyWrapper path="/webhooks-page/webhooks-page" />,
  },
  {
    path: "/model",
    element: <LazyWrapper path="/model-page/model-list" />,
  },
  {
    path: "/model/addModel",
    element: <LazyWrapper path="/model-page/addModel" />,
  },
  {
    path: "*",
    element: <>404 Not Found!</>,
  },
];
export { ROUTER_CONFIG };