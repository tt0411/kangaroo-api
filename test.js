  // const config = { headers: {'Content-Type': 'multipart/form-data'}} 
      // const domain = 'https://up-z2.qiniup.com'
      // const qiniuaddr = "pyku15h15.bkt.clouddn.com"
      // const keyname = 'dfairy' + Date.parse(new Date()) + Math.floor(Math.random() * 100) + '.png'
    
      // axios.get('http://localhost:3001/qiniu/uploadToken').then(res => {
      //  // console.log(res.data)
      //   const formdata =  new FormData()
      //   formdata.append('file', file.file[0].path)
      //   formdata.append('token', res.data.token)
      //   formdata.append('key', keyname)
      //   // 获取到凭证之后再将文件上传到七牛云空间
      //   axios.post(domain, formdata, config).then(res => {
      //     imageUrl = 'http://' + qiniuaddr + '/' + res.data.key
      //     console.log(imageUrl)
      //   })
      // }).catch(err =>
      //   console.log(err)  
      // )