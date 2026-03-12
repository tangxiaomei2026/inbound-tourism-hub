import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const articles = [
  // 英文文章（5篇）- 符合西方审美
  {
    title: "Unlocking China: 10 Hidden Gems That Will Transform Your Travel Experience",
    content: `China is not just about the Great Wall and the Forbidden City. Beyond these iconic landmarks lies a treasure trove of experiences waiting to be discovered by adventurous travelers.

From the mist-shrouded mountains of Guilin to the ancient water towns of Jiangnan, China offers a diverse tapestry of landscapes and cultures that challenge every Western stereotype.

## Why China Should Top Your 2024 Travel List

With visa-free policies now covering 54 cities and high-speed rail connecting major destinations, exploring China has never been easier. The country's tourism infrastructure has evolved dramatically, offering world-class hospitality while preserving authentic cultural experiences.

## The Food Revolution

Forget everything you know about Chinese food from your local takeaway. Real Chinese cuisine is a revelation – from the fiery depths of Sichuan hotpot to the delicate artistry of Cantonese dim sum. Food tours in Chengdu and Guangzhou are becoming the highlight of many travelers' itineraries.

## Digital Innovation Meets Ancient Tradition

China's seamless blend of cutting-edge technology and millennia-old culture creates unique travel moments. Imagine using your phone to unlock a 600-year-old temple's hidden stories through AR, or paying for street food with a facial recognition system.

## The Bottom Line

China in 2024 offers something increasingly rare in global tourism: genuine discovery. Whether you're a culture enthusiast, foodie, or adventure seeker, the Middle Kingdom delivers experiences that will reshape your understanding of this complex, fascinating nation.

Start planning your China adventure today – the journey of a lifetime awaits.`,
    category: "Travel Guide",
    source: "AI Generated",
    ai_generated: true,
    language: "en"
  },
  {
    title: "Beyond the Great Wall: China's Best-Kept Secrets Revealed",
    content: `When most travelers think of China, they imagine the Great Wall and the Terracotta Warriors. But the real magic happens when you venture off the beaten path.

## Hidden Treasures Await

In the remote valleys of Yunnan, ancient tea horses trails wind through landscapes that seem frozen in time. Here, minority communities maintain traditions unchanged for centuries, offering visitors a glimpse into a China that few Westerners ever see.

## The New Silk Road

China's Belt and Road Initiative has transformed ancient trade routes into modern tourism corridors. Travelers can now follow in the footsteps of Marco Polo, experiencing the same awe-inspiring landscapes that captivated the great explorer.

## Sustainable Tourism

China is rapidly becoming a leader in sustainable travel. Eco-lodges in remote regions offer authentic experiences while supporting local communities. From panda conservation programs to traditional craft workshops, visitors can make a positive impact while exploring.

## Planning Your Journey

The best time to visit depends on your destination. Spring and autumn offer ideal weather for most regions, while winter brings unique opportunities like the Harbin Ice Festival.

Don't just visit China – experience it deeply, authentically, and memorably.`,
    category: "Travel Guide",
    source: "AI Generated",
    ai_generated: true,
    language: "en"
  },
  {
    title: "China's Culinary Revolution: A Food Lover's Paradise",
    content: `If you think you know Chinese food, think again. China's culinary landscape is undergoing a renaissance that's captivating food lovers worldwide.

## From Street Food to Fine Dining

China's food scene spans the entire spectrum. Night markets in Taipei offer sensory overload with sizzling woks and aromatic spices, while Michelin-starred restaurants in Shanghai redefine Chinese haute cuisine.

## Regional Diversity

Each province boasts its own culinary identity:
- **Sichuan**: Bold, spicy, and numbing flavors
- **Cantonese**: Delicate, fresh, and refined
- **Shanghainese**: Sweet, savory, and rich
- **Xinjiang**: Influenced by Central Asian traditions

## Food Tourism Trends

Culinary tours are booming. Travelers can learn dumpling-making from local masters, explore tea plantations in Fujian, or embark on spicy food challenges in Chongqing.

## The Future of Chinese Cuisine

Young chefs are reimagining traditional dishes, creating fusion concepts that honor heritage while embracing innovation. The result? A food scene that's simultaneously ancient and cutting-edge.

Come hungry, leave inspired. China's culinary revolution is just getting started.`,
    category: "Food & Culture",
    source: "AI Generated",
    ai_generated: true,
    language: "en"
  },
  {
    title: "Smart Travel: How Technology is Revolutionizing Tourism in China",
    content: `China isn't just keeping pace with the digital revolution – it's leading it. For travelers, this means unprecedented convenience and unique experiences.

## Cashless Society

China has leapfrogged credit cards to become almost entirely cashless. Mobile payment apps like Alipay and WeChat Pay work everywhere, from street vendors to high-end boutiques. Tourists can now use international versions of these apps.

## AI-Powered Experiences

Artificial intelligence enhances every aspect of Chinese tourism:
- Real-time translation apps break down language barriers
- AI concierges provide personalized recommendations
- Facial recognition enables seamless hotel check-ins

## High-Speed Connectivity

5G networks blanket major cities, enabling augmented reality tours and instant sharing of travel moments. Download a map in seconds, stream 4K video from remote locations, or video call home from the Great Wall.

## Smart Transportation

China's high-speed rail network is the world's largest, connecting cities faster than flying. Apps provide real-time schedules, seat selection, and even meal delivery to your train seat.

## The Human Touch Remains

Despite the technology, China's warmth and hospitality shine through. Technology enhances rather than replaces the human connections that make travel meaningful.

Welcome to the future of travel – it's already here in China.`,
    category: "Technology",
    source: "AI Generated",
    ai_generated: true,
    language: "en"
  },
  {
    title: "Living Heritage: Experiencing China's Intangible Cultural Treasures",
    content: `While China's ancient monuments draw millions, its living cultural heritage offers equally profound experiences. These traditions, passed down through generations, provide windows into the soul of Chinese civilization.

## Masters of Craft

In workshops across the country, master craftspeople practice arts perfected over millennia:
- **Suzhou embroidery**: Creating images so detailed they appear photographic
- **Jingdezhen porcelain**: The world's finest ceramics, unchanged for 1,000 years
- **Traditional medicine**: Ancient healing practices gaining global recognition

## Performance Arts

China's performing arts scene blends tradition with innovation:
- **Kunqu opera**: An ancient art form influencing modern theater
- **Shadow puppetry**: Storytelling through light and silhouette
- **Traditional instruments**: The guqin, pipa, and erhu creating hauntingly beautiful music

## Cultural Immersion Programs

Visitors can now participate in authentic cultural experiences:
- Tea ceremonies led by certified masters
- Calligraphy workshops with renowned artists
- Traditional cooking classes in historic courtyard homes

## Preserving the Past, Embracing the Future

These cultural traditions aren't museum pieces – they're living, evolving practices that continue to shape Chinese identity. By experiencing them, travelers become part of their ongoing story.

Discover the China that lives in the hearts of its people – through the traditions they cherish and share.`,
    category: "Culture",
    source: "AI Generated",
    ai_generated: true,
    language: "en"
  },
  // 中文文章（5篇）
  {
    title: "2024年中国入境游全面复苏：文化体验成新热点",
    content: `随着全球旅游业的全面复苏，中国入境游市场正迎来前所未有的发展机遇。2024年，中国接待入境游客数量创下新高，预计全年将突破5000万人次，同比增长超过35%。

## 入境游市场现状

根据文化和旅游部最新发布的数据，2024年上半年中国入境游客主要来自：
- 东亚地区（占比42%）：日本、韩国、新加坡
- 东南亚地区（占比28%）：泰国、马来西亚、越南
- 欧美地区（占比18%）：美国、英国、德国、法国

## 文化体验受热捧

调查显示，78%的入境游客表示对中国非物质文化遗产"非常感兴趣"。最受欢迎的体验项目包括传统手工艺、戏曲表演、茶道文化和书法绘画。

## 智慧旅游新发展

2024年，中国旅游业数字化转型加速，携程推出"全球旅行家"计划，美团推出"无界旅游"服务，为入境游客提供了前所未有的便利。

## 未来展望

专家预测，到2030年，中国入境游客年接待量将达1亿人次，中国将成为全球第一大入境旅游目的地国。`,
    category: "新闻",
    source: "AI生成",
    ai_generated: true,
    language: "zh"
  },
  {
    title: "外国游客最爱的中国美食：从街头小吃到米其林餐厅",
    content: `中国美食正成为吸引入境游客的重要因素。美团数据显示，入境游客平均每人每天餐饮消费达280元，美食旅游已成为新宠。

## 最受欢迎的中国美食

1. **北京烤鸭** - 皮脆肉嫩，享誉世界
2. **四川火锅** - 麻辣鲜香，刺激味蕾
3. **广式早茶** - 精致点心，悠闲享受
4. **兰州拉面** - 汤清面劲，百姓美食
5. **小笼包** - 皮薄汁多，江南特色

## 美食街区推荐

- 成都锦里：川菜小吃一条街
- 西安回民街：西北风味聚集地
- 上海城隍庙：江南美食荟萃
- 广州上下九：粤菜文化体验

## 美食旅游新趋势

越来越多的入境游客选择参加美食主题旅游团，深入体验中国饮食文化。从川菜烹饪课程到茶道体验，从酒庄参观到农家乐，美食旅游形式日益丰富。

中国美食，正在征服世界味蕾！`,
    category: "美食",
    source: "AI生成",
    ai_generated: true,
    language: "zh"
  },
  {
    title: "中国高铁旅游：连接美景的钢铁巨龙",
    content: `中国高铁网络的完善，让入境游客能够快速到达各地景区，极大提升了旅游体验。目前，中国高铁运营里程超过4万公里，居世界第一。

## 高铁旅游优势

- **速度快**：北京到上海仅需4.5小时
- **准点率高**：平均准点率超过95%
- **覆盖广**：连接所有省会城市和主要旅游城市
- **体验好**：宽敞舒适，服务优质

## 热门高铁旅游线路

1. **京沪高铁**：北京-南京-上海，文化之旅
2. **西成高铁**：西安-成都，美食之旅
3. **贵广高铁**：贵阳-桂林-广州，山水之旅
4. **杭黄高铁**：杭州-黄山，江南之旅

## 入境游客评价

"中国高铁太棒了！舒适、快速、准时，让旅行变得轻松愉快。"——来自德国的游客

高铁，让中国的美景触手可及！`,
    category: "交通",
    source: "AI生成",
    ai_generated: true,
    language: "zh"
  },
  {
    title: "中国签证政策大放宽：144小时过境免签覆盖54城",
    content: `2024年，中国推出多项签证便利措施，极大促进了入境游发展。144小时过境免签政策已覆盖54个城市，让更多外国游客能够便捷地访问中国。

## 主要签证便利措施

### 144小时过境免签
- 覆盖54个城市
- 适用于53个国家公民
- 可在指定区域内停留6天

### 区域性免签政策
- **海南**：59国免签入境
- **上海邮轮**：15天免签
- **广东珠三角**：144小时免签

### 电子签证
- 在线申请，3天出签
- 简化材料，便捷高效

## 入境游客反馈

新政策实施后，入境游客数量显著增长。许多游客表示，签证便利化让他们更愿意选择中国作为旅行目的地。

## 未来展望

中国将继续推进签证便利化，目标是实现更多国家免签入境，让世界各国人民都能便捷地感受中国魅力。`,
    category: "政策",
    source: "AI生成",
    ai_generated: true,
    language: "zh"
  },
  {
    title: "中国非遗文化体验：让传统活在当下",
    content: `中国的非物质文化遗产正成为入境游的新亮点。从传统手工艺到戏曲表演，从茶道文化到书法绘画，越来越多的外国游客选择深度文化体验游。

## 热门非遗体验项目

### 传统手工艺
- **剪纸**：一张红纸，一把剪刀，剪出万千世界
- **泥塑**：天津泥人张，栩栩如生
- **刺绣**：苏绣、湘绣、蜀绣、粤绣，四大名绣

### 戏曲表演
- **京剧**：国粹艺术，唱念做打
- **昆曲**：百戏之祖，典雅唯美
- **川剧变脸**：神秘莫测，叹为观止

### 茶道文化
- **功夫茶**：潮汕功夫茶，精致讲究
- **茶艺表演**：赏茶、泡茶、品茶，全流程体验

## 非遗旅游新趋势

越来越多的景区推出非遗体验项目，游客可以：
- 亲手制作传统手工艺品
- 跟随传承人学习传统技艺
- 参与非遗文化展演活动

## 文化价值

非遗体验不仅让游客了解中国传统文化，更促进了文化传承和保护。每一次体验，都是对传统文化的传播和弘扬。

来中国，体验活着的传统文化！`,
    category: "文化",
    source: "AI生成",
    ai_generated: true,
    language: "zh"
  }
];

async function seedArticles() {
  console.log('🌱 Seeding articles...');
  
  try {
    // Clear existing articles
    await pool.query('DELETE FROM articles');
    console.log('✅ Cleared existing articles');
    
    // Insert articles
    for (const article of articles) {
      await pool.query(
        `INSERT INTO articles (title, content, category, source, ai_generated, language) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [article.title, article.content, article.category, article.source, article.ai_generated, article.language]
      );
      console.log(`✅ Added: ${article.title.substring(0, 50)}...`);
    }
    
    console.log(`\n✨ Successfully seeded ${articles.length} articles!`);
    console.log(`🇨🇳 Chinese: ${articles.filter(a => a.language === 'zh').length}`);
    console.log(`🇬🇧 English: ${articles.filter(a => a.language === 'en').length}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

seedArticles();
