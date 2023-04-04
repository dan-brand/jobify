import Wrapper from '../assets/wrappers/StatItem';

function StatItem({ count, title, icon, color, bcg }) {
  return (
    // We are passing the color and bcg as props to the StatItem wrapper
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className='count'>{count}</span>
        <div className='icon'>{icon}</div>
      </header>
      <h5 className='title'>{title}</h5>
    </Wrapper>
  );
}

export default StatItem;