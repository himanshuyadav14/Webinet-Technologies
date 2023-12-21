export default function Post(){
    return(
        <div className="post">
        <div className="image">
          <img src="https://images.pexels.com/photos/3601081/pexels-photo-3601081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"></img>
        </div>
        <div className="texts">
          <h2>Full House Battery Backup Coming Later this year</h2>
          <p className="info">
            <a className="author">Himanshu</a>
            <time>2023-12-19 17:32</time>
          </p>
          <p className="summary">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus ratione sunt tenetur, recusandae accusantium molestias
            numquam culpa saepe libero. Reiciendis quas maiores laudantium quo
            molestiae labore? Optio reiciendis dolore impedit.
          </p>
        </div>
      </div>
    );
}