import { GetStaticProps } from 'next';
import Head from 'next/head';
import { format } from 'date-fns';
import { FaCalendar, FaUser } from 'react-icons/fa';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [myPostsPagination, setMyPostsPagination] = useState(postsPagination);

  function loadMorePosts() {
    if (myPostsPagination.next_page) {
      fetch(myPostsPagination.next_page)
      .then(response => response.json())
      .then(data => { 

        const newPostList: Post[] = data.results.map((post: Post) => {
          console.log(post.uid)
          return {
            uid: post.uid,
            first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy'),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            }
          }
        })

        setMyPostsPagination({
          next_page: data.next_page,
          results: [...myPostsPagination.results, ...newPostList],
        })
      });
    }
  }

  return (
    <>
      <Head>
        <title>Home | Spacetravelling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.posts}>
            { myPostsPagination.results.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`} legacyBehavior={true}>
                <a href="">
                  <h2>{post.data.title}</h2>
                  <span>{post.data.subtitle}</span>
                  <div>
                    <div className={styles.date}>
                      <FaCalendar color="#BBBBBB" />
                      <span>{post.first_publication_date}</span>
                    </div>
                    <div className={styles.author}>
                      <FaUser color="#BBBBBB" />
                      <span>{post.data.author}</span>
                    </div>
                  </div>
               </a>
              </Link>
            )) }
          </div>
          { myPostsPagination.next_page && (
            <button className={styles.loadMore} onClick={loadMorePosts}>Carregar mais posts</button>
          ) }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  
  const postsResponse = await prismic.getByType('posts', {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 3,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy'),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  });


  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    }
  }

};
