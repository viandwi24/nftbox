import{u as g,_ as x}from"./use-connection.1e9148c9.js";import{_ as v}from"./nuxt-link.edb59076.js";import{u as y,s as b}from"./web3.a8c04880.js";import{a as k,W as w,X as d,Y as B,h as r,a1 as e,Z as C,$ as l,a5 as N,a6 as $,u as c,a0 as P,o as a,a8 as V,c as L,a4 as u}from"./entry.c9c9d3e3.js";import"@nftbox/contract/target/idl/nftbox.json";const S={class:"flex flex-col mt-2"},j={class:"flex mb-8"},A={class:"card-container grid grid-cols-4 gap-6"},F={class:"card-item-inside shadow rounded-2xl overflow-hidden"},M=["src"],z={class:"mt-3 pl-2"},D={class:"text-lg font-bold pr-4"},E={class:"font-light text-sm"},I={key:0},q=k({__name:"index",setup(K){y(".card-container .card-item-inside"),g();const _=w(),n=d(!1),i=d([]),m=async()=>{n.value=!0;const o=await _.nftbox.value.getBoxSetAccountAll();i.value.push(...o.map(t=>({address:t.publicKey,name:t.account.name,description:t.account.description,image:t.account.image,authority:t.account.authority,state:t.account.state===0?0:1}))),n.value=!1};return B(()=>{m()}),(o,t)=>{const h=x,p=v;return a(),r("div",S,[e("div",j,[C(h,{to:"/box/create",size:"sm"},{default:l(()=>[V("Create Box")]),_:1})]),e("div",A,[(a(!0),r(N,null,$(c(i),(s,f)=>(a(),L(p,{key:f,class:"group cursor-pointer card-item rounded-xl border overflow-hidden px-3 py-3 shadow-lg border-slate-500/50",to:{name:"box-address",params:{address:s.address.toString()}}},{default:l(()=>[e("div",F,[e("img",{src:`${s.image}?r=${Math.random()}`,style:{height:"100%",width:"100%",objectFit:"cover",objectPosition:"center"},class:"group-hover:scale-110 transition-all duration-300"},null,8,M)]),e("div",z,[e("div",D,u(s.name),1),e("div",E,u(("shortPubkey"in o?o.shortPubkey:c(b))(s.authority)),1)])]),_:2},1032,["to"]))),128)),c(n)?(a(),r("div",I,"Loading...")):P("",!0)])])}}});export{q as default};