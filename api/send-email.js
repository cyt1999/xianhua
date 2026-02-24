import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { name, phone, wechat, interest, message } = req.body;

    // 验证必填字段
    if (!name || !phone || !wechat || !interest) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 发送邮件
    // 注意：在Resend验证域名之前，发送到注册邮箱进行测试
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'xianhua_trading@outlook.com',
      subject: '新的联系表单提交 - 显化资本',
      html: `
        <h1>新的联系表单提交</h1>
        <p><strong>姓名:</strong> ${name}</p>
        <p><strong>手机号码:</strong> ${phone}</p>
        <p><strong>微信号:</strong> ${wechat}</p>
        <p><strong>感兴趣的问题:</strong> ${interest}</p>
        <p><strong>留言内容:</strong></p>
        <p>${message || '无'}</p>
      `
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: '发送邮件失败，请稍后重试' });
  }
}