import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function AnimeDetail() {
  const { id } = useParams();  // ここを mal_id から id に変更
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);  // id を使う
        setAnime(res.data.data);
      } catch (e) {
        setError("詳細情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!anime) return <p>アニメが見つかりません</p>;

  return (
    <div className="anime-detail-container">
      <Link to="/" className="back-link">← 検索画面に戻る</Link>

      <h1 className="title">{anime.title}</h1>

      <div className="top-section">
        <img
          src={anime.images?.jpg.large_image_url}
          alt={anime.title}
          className="anime-image"
          loading="lazy"
        />
        <div className="info">
          <p><strong>放送開始:</strong> {anime.aired?.string || "不明"}</p>
          <p><strong>エピソード数:</strong> {anime.episodes ?? "不明"}</p>
          <p><strong>スコア:</strong> {anime.score ?? "なし"}</p>
          <p><strong>ジャンル:</strong> {anime.genres.map(g => g.name).join(", ") || "なし"}</p>
          <p><strong>ステータス:</strong> {anime.status}</p>
          <p><strong>製作会社:</strong> {anime.producers.map(p => p.name).join(", ") || "なし"}</p>
        </div>
      </div>

      <section className="synopsis-section">
        <h2>あらすじ</h2>
        <p>{anime.synopsis || "情報なし"}</p>
      </section>

      <style>{`
        .anime-detail-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: sans-serif;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 1rem;
          text-decoration: none;
          color: #007bff;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .title {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #222;
        }
        .top-section {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .anime-image {
          max-width: 280px;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          object-fit: cover;
        }
        .info {
          flex: 1;
          min-width: 200px;
          font-size: 1rem;
          color: #444;
        }
        .info p {
          margin: 0.3rem 0;
        }
        .synopsis-section h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .synopsis-section p {
          line-height: 1.6;
          white-space: pre-wrap;
          color: #555;
        }
        @media (max-width: 600px) {
          .top-section {
            flex-direction: column;
            align-items: center;
          }
          .info {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
