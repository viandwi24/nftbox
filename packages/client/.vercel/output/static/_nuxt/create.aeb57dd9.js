import{_ as g}from"./Card.19cd4dcf.js";import{u as w}from"./use-anchor-wallet.641189eb.js";import{a as B,U as S,W as C,X as p,f as k,c as A,$ as m,P as V,o as r,u as t,h as i,a1 as e,a2 as c,a3 as u,a4 as N,a0 as h}from"./entry.c9c9d3e3.js";import"@nftbox/contract/target/idl/nftbox.json";const U=e("div",{class:"font-bold text-xl"},"Create Box Set",-1),D={key:0,class:"text-center"},E={key:1,class:"flex flex-col space-y-4"},M={class:"flex"},T=e("div",{class:"w-1/5 mt-2"},"Authority Address",-1),W={class:"flex-1"},$=["value"],K={class:"flex"},P=e("div",{class:"w-1/5 mt-2"},"Box Set Address",-1),F={class:"flex-1"},j=["value"],I=e("div",{class:"font-thin text-sm mt-1"}," * this is generate automaticly (pda) from seed (authority + name) ",-1),R={class:"flex"},X=e("div",{class:"w-1/5 mt-2"},"Box Set Name",-1),q={class:"flex-1"},z={class:"flex"},G=e("div",{class:"w-1/5 mt-2"},"Box Set Description",-1),H={class:"flex-1"},J={class:"flex"},L=e("div",{class:"w-1/5 mt-2"},"Box Set Image",-1),O={class:"flex-1"},Q={class:"flex"},Y=e("div",{class:"w-1/5 mt-2"},"Box Set Max Supply",-1),Z={class:"flex-1"},ee={class:"flex items-center justify-between"},te={key:0,class:"text-red-500"},re=B({__name:"create",setup(se){const n=w(),v=S(),{nftbox:x}=C(),s=p({name:"My Misterious Box NFTs",description:"This is a box set of NFTs",image:"https://api.dicebear.com/5.x/pixel-art/svg?seed=Example&autogenerated",max_supply:100}),f=k(()=>x.value?.findPDABoxSet(n.value?.publicKey||new V(""),s.value.name)?.toBase58()||""),_=p(!1),d=p(),y=async()=>{if(n.value){d.value=void 0,_.value=!0;try{console.log("a");const l=await x.value?.boxset()?.create(s.value.name,s.value.description,s.value.image,s.value.max_supply);console.log("created",l),alert("Box Set Created"),v.push("/")}catch(l){l instanceof Error&&(d.value=`${l.message} (${l.name})`)}_.value=!1}};return(l,o)=>{const b=g;return r(),A(b,null,{header:m(()=>[U]),default:m(()=>[t(n)?(r(),i("div",E,[e("div",M,[T,e("div",W,[e("input",{type:"text",class:"w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800",readonly:"",value:t(n)?.publicKey?.toString()},null,8,$)])]),e("div",K,[P,e("div",F,[e("input",{type:"text",class:"w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800",readonly:"",value:t(f)},null,8,j),I])]),e("div",R,[X,e("div",q,[c(e("input",{type:"text",class:"w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800","onUpdate:modelValue":o[0]||(o[0]=a=>t(s).name=a)},null,512),[[u,t(s).name]])])]),e("div",z,[G,e("div",H,[c(e("input",{type:"text",class:"w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800","onUpdate:modelValue":o[1]||(o[1]=a=>t(s).description=a)},null,512),[[u,t(s).description]])])]),e("div",J,[L,e("div",O,[c(e("input",{type:"text",class:"w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800","onUpdate:modelValue":o[2]||(o[2]=a=>t(s).image=a)},null,512),[[u,t(s).image]])])]),e("div",Q,[Y,e("div",Z,[c(e("input",{type:"number",class:"w-full border-2 border-white/10 rounded-lg px-4 py-2 bg-transparent text-white read-only:bg-slate-800","onUpdate:modelValue":o[3]||(o[3]=a=>t(s).max_supply=a)},null,512),[[u,t(s).max_supply]])])]),e("div",ee,[e("div",null,[t(d)?(r(),i("div",te,"* Error : "+N(t(d)),1)):h("",!0)]),t(n)?(r(),i("button",{key:0,class:"bg-primary-500 rounded-lg px-4 py-2 text-white font-bold",onClick:y}," Create ")):h("",!0)])])):(r(),i("div",D,"Connect Wallet to continue"))]),_:1})}}});export{re as default};
