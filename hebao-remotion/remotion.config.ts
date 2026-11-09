import { Config } from '@remotion/cli/config';

/**
 * 渲染配置 —— 直接吸收上轮审查得到的结论：
 * - 中间帧用 JPEG(q100)：PNG 的 zlib 压缩会吃掉 96% 的时间，q100 实测 PSNR 46dB 视觉无损
 * - concurrency 6：本机 22 核，编码与截图混合负载下 6 路最稳
 * - crf 19 + medium：体积与观感的平衡点（crf17/slow 只多 20% 体积却慢一倍）
 */
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(100);
Config.setConcurrency(6);
Config.setCodec('h264');
Config.setCrf(19);
Config.setPixelFormat('yuv420p');
Config.setX264Preset('medium');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
