import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  // const cloudinaryUrl = `https://res.cloudinary.com/dacjab22h/image/upload/${cover}`;
  const cloudinaryUrl = cover;
  // console.log(cover);

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={cloudinaryUrl} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <Link to={`/user/${author._id}`} className="author">
            {author.username}
          </Link>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
