const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

// 민원 게시판
router.get(
    ["/board"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Board",
        };
        const data = await Post.find().select('title content author views createdAt');
        res.render("board", { locals, data, layout: mainLayout });
    })
);

// 제보 게시판
router.get(
    ["/report"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Report",
        };
        const data = await Post.find().select('title content author views createdAt');
        res.render("report", { locals, data, layout: mainLayout });
    })
);

// HOT 게시판
router.get(
    ["/hot"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Hot",
        };
        const data = await Post.find().select('title content author views createdAt');
        res.render("hot", { locals, data, layout: mainLayout });
    })
);

// 공지 게시판
router.get(
    ["/notice"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Notice",
        };
        const data = await Post.find().select('title content author views createdAt');
        res.render("notice", { locals, data, layout: mainLayout });
    })
);

//내 게시글 보기(로그인 하고)
router.get(
    ["/mywrite"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "MyWrite",
        };
        const data = await Post.find().select('title content author views createdAt');
        res.render("mywrite", { locals, data, layout: mainLayout });
    })
)

// 게시글 상세보기
router.get("/post/:id", asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    
    res.render("post", { post, layout: mainLayout });
}));

// 게시글 추천 기능
router.post('/post/:id/recommend', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      post.recommendations++; // 추천 수 증가
      await post.save();
      res.json({ recommendations: post.recommendations });
    } catch (error) {
      console.error('Error recommending post:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

router.get('/board', async (req, res) => {
    try {
      // 게시글 데이터와 추천 수를 함께 가져옴
      const posts = await Post.find().select('title author recommendations createdAt');
      res.render('board', { posts, layout: mainLayout });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Internal server error');
    }
  });
  

//검색기능
router.get("/search", asyncHandler(async (req, res) => {
    // 클라이언트로부터 검색어를 받음
    const searchKeyword = req.query.query;

    // 검색어가 제공되지 않은 경우 기본 검색어 설정
    const keyword = searchKeyword || "기본 검색어";
    console.log(searchKeyword)

    try {
        // 정규 표현식을 사용하여 제목에서 검색 단어를 포함하는 게시물 찾기
        const searchResults = await Post.find({ title: { $regex: keyword, $options: 'i' } })
          .select('title content createdAt');
    
        res.render('search-results', { data: searchResults, layout: 'layouts/main' });
      } catch (err) {
        res.status(500).send({ error: '검색 중 오류가 발생했습니다.' });
      }
}));

module.exports = router;

