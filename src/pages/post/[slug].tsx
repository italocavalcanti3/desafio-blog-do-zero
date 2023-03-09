import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FaCalendar, FaClock, FaUser } from 'react-icons/fa';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const readingTime = post.data.content.reduce((acc, content) => {
    const headingWords = content.heading.split(' ');
    const bodyWords = RichText.asText(content.body).split(' ');
    acc += headingWords.length;
    acc += bodyWords.length;

    return acc;
  }, 0)

  return (
    <>
      <Head>
        <title>Post | Spacetraveling</title>
      </Head>
      <main className={styles.container}>

        <img src={post.data.banner.url} alt="Imagem em destaque" />

        <div className={styles.content}>

          <div className={styles.postHeader}>
            <h2>{post.data.title}</h2>
            <div className={styles.postInfo}>
              <div className={styles.date}>
                <FaCalendar color="#BBBBBB" />
                <span>{post.first_publication_date}</span>
              </div>
              <div className={styles.author}>
                <FaUser color="#BBBBBB" />
                <span>{post.data.author}</span>
              </div>
              <div className={styles.author}>
                <FaClock color="#BBBBBB" />
                <time>{Math.ceil(readingTime / 200)} min</time>
              </div>
            </div>
          </div>

          <div className={styles.postContent}>
            {post.data.content.map(content => (
              <section key={content.heading}>
                <h2>{content.heading}</h2>
                {content.body.map(body => (
                  <p key={body.text}>{body.text}</p>
                ))}
              </section>
            ))}
          </div>          

        </div>

      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const params = posts.results.map(post => ({
    params: {
      slug: post.uid
    }
  }))

  return {
    paths: params,
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response);
  const post: Post = {
    uid: response.uid,
    first_publication_date: format(new Date(response.first_publication_date), 'dd MMM yyyy'),
    data: {
      title: response.data.title,
      author: response.data.author,
      banner: { url: response.data.banner.url },
      content: response.data.content
    }
  }


  return {
    props: {
      post,
    }
  }
};
