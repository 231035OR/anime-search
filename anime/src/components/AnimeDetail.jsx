import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedSynopsis, setTranslatedSynopsis] = useState("");

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(res.data.data);

        if (res.data.data.synopsis) {
          const translated = await translateWithLibre(res.data.data.synopsis);
          setTranslatedSynopsis(translated);
        } else {
          setTranslatedSynopsis("情報なし");
        }
      } catch (e) {
        setError("詳細情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [id]);

  // LibreTranslate を使った翻訳関数
  async function translateWithLibre(text) {
    try {
      const res = await axios.post(
        "http://54.224.198.246:8000/translate",
        {
          text: text,
          target_lang: "ja",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data.translatedText;
    } catch (e) {
      console.error("LibreTranslate翻訳エラー:", e.response?.data || e.message || e);
      return "翻訳できませんでした";
    }
  }

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
        <h2>あらすじ（日本語訳）</h2>
        <p>{translatedSynopsis}</p>
      </section>
    </div>
  );
}
