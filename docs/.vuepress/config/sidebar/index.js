//侧边栏
module.exports = {
    '/views/': [
        '',
        {
            title: '高级分销',
            collapsable: true,
            children: [
                'distribution/dis-ec',
                'distribution/share',
                'distribution/cash',
                'distribution/wechat'
            ]
        },
        {
            title: '规范 Standard',
            collapsable: true,
            children: [
                'specification/git'
            ]
        },
        // {
        //     title: '随笔 Essay',
        //     collapsable: true,
        //     children: [
        //         'essay/20190928',
        //         'essay/20191109',
        //         'essay/20191116',
        //         'essay/20191130',
        //         'essay/20200227',
        //         'essay/20200301'
        //     ]
        // }

    ]
}
