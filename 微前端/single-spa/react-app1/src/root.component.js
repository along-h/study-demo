// import "./style.css";

export default function Root(props) {
  console.log(props, "--react-app1-props");
  return <section className="container">{props.name} is mounted!</section>;
}
