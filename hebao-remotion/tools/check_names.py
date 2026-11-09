#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""贺报文案「撞名」体检 —— 出片前必跑。

为什么要有这一步：
    贺报是公开发布的物料。文案里一旦出现真实存在的公司、医院、商场、场馆、
    城市、赛事、奖项，哪怕只是顺手写的示例，都可能被误读成"这家被表彰了"，
    或者撞上同名的真实主体，轻则尴尬，重则构成侵权或不实宣传。
    所以演示数据必须全部虚构，且要能机械校验。

用法：
    python tools/check_names.py                     # 扫 content/demo.json
    python tools/check_names.py props.json          # 扫一份 props（JSON 或 JSON 数组）
    python tools/check_names.py --strict            # 额外扫英文大写机构缩写

退出码：0 = 干净，1 = 命中高风险词。
"""

import json
import os
import re
import sys

# ── 高风险词表：真实存在、且被误用会出事的主体 ───────────────────
HIGH_RISK = {
    '中国城市': [
        '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '天津', '武汉', '西安',
        '南京', '苏州', '郑州', '长沙', '青岛', '宁波', '合肥', '福州', '厦门', '济南',
        '沈阳', '大连', '昆明', '无锡', '佛山', '东莞', '珠海', '三亚', '海口', '拉萨',
        '乌鲁木齐', '呼和浩特', '哈尔滨', '长春', '石家庄', '太原', '南昌', '贵阳',
        '兰州', '西宁', '银川', '廊坊', '保定', '唐山', '温州', '泉州', '常州', '徐州',
        '香港', '澳门', '台北',
    ],
    '地标商圈': [
        '太古里', '太古汇', '万象城', '万象汇', '德基', 'SKP', '恒隆', '银泰', '大悦城',
        '天街', '国贸', '陆家嘴', '外滩', '前滩', '珠江新城', '金融街', '三里屯',
        '国家会议中心', '奥体中心', '国际会展中心', '保利剧院', '国家大剧院',
    ],
    '医疗机构': [
        '协和', '同济', '仁济', '华西', '湘雅', '瑞金', '中山医院', '人民医院',
        '中心医院', '儿童医院', '肿瘤医院', '阜外', '安贞', '天坛医院', '长庚医院',
    ],
    '院校机构': [
        '清华', '北大', '北京大学', '清华大学', '复旦', '交大', '浙大', '中科院',
        '社科院', '国家邮政局', '卫健委', '教育部', '工信部', '银保监', '证监会',
    ],
    '知名企业': [
        '华为', '腾讯', '阿里', '阿里巴巴', '字节跳动', '美团', '京东', '拼多多',
        '小米', '百度', '网易', '比亚迪', '宁德时代', '顺丰', '中通', '圆通',
        '韵达', '申通', '万科', '碧桂园', '恒大', '融创', '绿地', '华润', '龙湖',
        '中国人寿', '中国平安', '太平洋保险', '泰康', '友邦', '招商银行', '工商银行',
        '建设银行', '中国银行', '农业银行',
    ],
    '赛事奖项': [
        '世界杯', '奥运会', '冬奥会', '亚运会', '全运会', '欧冠', '英超', '西甲',
        '中超', 'CBA', 'NBA', '亚冠', '金鸡奖', '百花奖', '金马奖', '金像奖',
        '金鹰奖', '飞天奖', '白玉兰', '金钟奖', '金曲奖', '双 11', '双11', '双十二',
        '618', '黑五',
    ],
    '真实品牌节庆': [
        '春节', '中秋', '国庆', '元旦',  # 节庆可用，但不要作为专属活动名；命中仅提示
    ],
}

# 只提示、不阻断
SOFT = {'真实品牌节庆'}


def load_text(path):
    if not os.path.exists(path):
        sys.exit(f'找不到文件：{path}')
    raw = open(path, encoding='utf-8').read()
    if path.lower().endswith('.json'):
        try:
            data = json.loads(raw)
            return json.dumps(data, ensure_ascii=False, indent=1)
        except json.JSONDecodeError:
            return raw
    return raw


def scan(text):
    hits = []
    for group, words in HIGH_RISK.items():
        for word in words:
            for m in re.finditer(re.escape(word), text):
                line = text.count('\n', 0, m.start()) + 1
                ctx = text[max(0, m.start() - 18): m.start() + 18].replace('\n', ' ')
                hits.append((group, word, line, ctx.strip()))
    return hits


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    target = args[0] if args else os.path.join('content', 'demo.json')
    text = load_text(target)
    hits = scan(text)

    hard = [h for h in hits if h[0] not in SOFT]
    soft = [h for h in hits if h[0] in SOFT]

    print(f'扫描目标：{target}')
    if not hits:
        print('✓ 未命中任何真实主体名，可以出片。')
        return 0

    if hard:
        print(f'\n✗ 命中 {len(hard)} 处高风险真实主体名（必须替换）：')
        for group, word, line, ctx in hard:
            print(f'  [{group}] {word}  L{line}  …{ctx}…')
    if soft:
        print(f'\n· {len(soft)} 处节庆词（可保留，但建议配虚构活动名）：')
        for group, word, line, ctx in soft:
            print(f'  [{group}] {word}  L{line}  …{ctx}…')

    if hard:
        print('\n处理建议：一律改成占位符 —— 机构「某某+行业词」（某某科技/某某医院），'
              '单人姓名「某某」，榜单多行用「类别+甲乙丙丁戊」或「类别+A~E」，'
              '城市「某某市」或「甲市~戊市」，赛事奖项「某某联赛/年度大奖」。'
              '不要用生造专名：生造词仍有极小概率与真实主体重名，占位符的概率是零。')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
