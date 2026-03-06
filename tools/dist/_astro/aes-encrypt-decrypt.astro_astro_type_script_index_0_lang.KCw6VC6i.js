const B=document.getElementById("aesPassphrase"),g=document.getElementById("aesInput"),c=document.getElementById("aesOutput"),n=document.getElementById("aesMessage"),A=document.getElementById("algorithmSearch"),l=document.getElementById("algorithmSelect"),G=document.getElementById("passphraseWrap"),N=document.getElementById("rsaFlowPanel"),y=document.getElementById("rsaPublicKey"),f=document.getElementById("rsaPrivateKey"),C=document.getElementById("selectedAlgorithmGuide"),k=new TextEncoder,P=new TextDecoder,u=[{key:"aes-gcm",label:"AES-GCM (Recommended)",subtleName:"AES-GCM",ivLength:12,params:e=>({name:"AES-GCM",iv:e})},{key:"aes-cbc",label:"AES-CBC",subtleName:"AES-CBC",ivLength:16,params:e=>({name:"AES-CBC",iv:e})},{key:"aes-ctr",label:"AES-CTR",subtleName:"AES-CTR",ivLength:16,params:e=>({name:"AES-CTR",counter:e,length:64})},{key:"rsa-oaep",label:"RSA-OAEP (Public/Private Key)",subtleName:"RSA-OAEP",family:"rsa",params:()=>({name:"RSA-OAEP"})}],E=e=>u.find(t=>t.key===e)||u[0],L=(e="")=>{if(!(l instanceof HTMLSelectElement))return;const t=e.trim().toLowerCase(),a=l.value||u[0].key,s=u.filter(i=>`${i.label} ${i.key}`.toLowerCase().includes(t)),r=s.length>0?s:u;l.innerHTML="";for(const i of r){const p=document.createElement("option");p.value=i.key,p.textContent=i.label,l.appendChild(p)}const d=r.some(i=>i.key===a);l.value=d?a:r[0].key};L();A?.addEventListener("input",()=>{L(A.value||""),m()});const R=()=>l instanceof HTMLSelectElement?E(l.value):u[0],w=e=>e.family==="rsa"?"rsa":"aes",x={"aes-gcm":{title:"AES-GCM (Recommended)",flow:"Flow sederhana berbasis passphrase. Memiliki autentikasi bawaan (integrity check).",useCase:"Pilihan utama untuk data teks umum karena seimbang: aman, modern, dan cepat.",format:"LPENCv2.aes-gcm.<salt>.<iv>.<cipher>",calculation:`K = PBKDF2(passphrase, salt, 120000, SHA-256, 256-bit)
( C, T ) = GCM_Encrypt(K, IV, P, AAD="")
Output = IV || C || T
Decrypt valid jika tag T cocok (integrity pass).`,flowchartHtml:`<div class="flowchart-visual">
                    <div class="flow-lane">
                        <div class="flow-node flow-start">Mulai</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Input Plaintext + Passphrase</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Derive Key (PBKDF2)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Generate IV 12-byte</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">AES-GCM Encrypt (Cipher + Tag)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Output Ciphertext</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-end">Selesai</div>
                    </div>
                </div>`},"aes-cbc":{title:"AES-CBC",flow:"Flow sederhana berbasis passphrase dengan IV 16 byte.",useCase:"Dipakai saat butuh kompatibilitas dengan sistem lama yang masih menggunakan CBC.",format:"LPENCv2.aes-cbc.<salt>.<iv>.<cipher>",calculation:`K = PBKDF2(passphrase, salt, 120000, SHA-256, 256-bit)
C1 = E_K(P1 XOR IV)
Ci = E_K(Pi XOR C(i-1))  untuk i > 1
Decrypt kebalikan proses blok, lalu unpadding.`,flowchartHtml:`<div class="flowchart-visual">
                    <div class="flow-lane">
                        <div class="flow-node flow-start">Mulai</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Input Ciphertext + Passphrase</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Derive Key (PBKDF2)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Init IV 16-byte</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">AES Decrypt Round Core</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-decision"><span>Blok terakhir?</span></div>
                        <div class="flow-branches">
                            <div class="flow-branch">Ya → Unpadding → Output Plaintext</div>
                            <div class="flow-branch">Tidak → Proses blok berikutnya</div>
                        </div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-end">Selesai</div>
                    </div>
                </div>`},"aes-ctr":{title:"AES-CTR",flow:"Flow sederhana berbasis passphrase dengan mode counter.",useCase:"Cocok untuk kebutuhan stream-like encryption dan interoperabilitas tertentu.",format:"LPENCv2.aes-ctr.<salt>.<iv>.<cipher>",calculation:`K = PBKDF2(passphrase, salt, 120000, SHA-256, 256-bit)
S_i = E_K(counter + i)
C_i = P_i XOR S_i
Decrypt: P_i = C_i XOR S_i (XOR simetris).`,flowchartHtml:`<div class="flowchart-visual">
                    <div class="flow-lane">
                        <div class="flow-node flow-start">Mulai</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Input Data + Passphrase</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Derive Key (PBKDF2)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Init Counter / Nonce</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Generate Keystream AES</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">XOR dengan data</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Output Cipher / Plaintext</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-end">Selesai</div>
                    </div>
                </div>`},"rsa-oaep":{title:"RSA-OAEP",flow:"Flow kompleks berbasis keypair. Encrypt pakai public key, decrypt pakai private key.",useCase:"Cocok untuk skenario pertukaran data lintas pihak tanpa berbagi passphrase.",format:"LPRSA1.rsa-oaep.<cipher>",calculation:`KeyGen: pilih n = p*q, public exponent e, private exponent d
OAEP pad: m -> EM
Encrypt: c = EM^e mod n (public key)
Decrypt: EM = c^d mod n (private key), lalu OAEP unpad -> m`,flowchartHtml:`<div class="flowchart-visual">
                    <div class="flow-lane">
                        <div class="flow-node flow-start">Mulai</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Generate / Load Keypair</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Encrypt (Public Key + OAEP)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Output Ciphertext</div>
                    </div>
                    <div class="flow-lane">
                        <div class="flow-node">Input Ciphertext</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node">Decrypt (Private Key + OAEP)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-io">Output Plaintext</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-node flow-end">Selesai</div>
                    </div>
                </div>`}},S=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),$=e=>{if(!(C instanceof HTMLDivElement))return;const t=x[e.key]||x["aes-gcm"];C.innerHTML=`
                <p class="text-sm font-semibold text-slate-900">${t.title}</p>
                <p class="mt-2 text-sm text-slate-700"><span class="font-semibold text-slate-900">Flow:</span> ${t.flow}</p>
                <p class="mt-2 text-sm text-slate-700"><span class="font-semibold text-slate-900">Use case:</span> ${t.useCase}</p>
                <p class="mt-2 text-sm text-slate-700"><span class="font-semibold text-slate-900">Format:</span> <code>${t.format}</code></p>
                <p class="mt-3 text-sm font-semibold text-slate-900">Perhitungan Inti</p>
                <pre class="mt-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-slate-700">${S(t.calculation)}</pre>
                <p class="mt-3 text-sm font-semibold text-slate-900">Flowchart</p>
                <div class="mt-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">${t.flowchartHtml||`<pre class="font-mono text-xs text-slate-700">${S(t.flowchart||"")}</pre>`}</div>
            `},m=()=>{const e=R(),t=w(e)==="rsa";G?.classList.toggle("hidden",t),N?.classList.toggle("hidden",!t),g instanceof HTMLTextAreaElement&&(g.placeholder=t?"Tulis plaintext untuk encrypt RSA, atau ciphertext format LPRSA1 untuk decrypt":"Tulis plaintext untuk enkripsi, atau ciphertext LPENCv2/LPENCv1 untuk dekripsi"),$(e)};l?.addEventListener("change",m);m();const v=e=>{let t="";for(let s=0;s<e.length;s+=32768)t+=String.fromCharCode(...e.subarray(s,s+32768));return btoa(t)},o=e=>{const t=atob(e),a=new Uint8Array(t.length);for(let s=0;s<t.length;s+=1)a[s]=t.charCodeAt(s);return a},F=e=>e.replace(/-----BEGIN [^-]+-----/g,"").replace(/-----END [^-]+-----/g,"").replace(/\s+/g,""),K=(e,t)=>{const a=v(e),s=a.match(/.{1,64}/g)?.join(`
`)||a;return`-----BEGIN ${t}-----
${s}
-----END ${t}-----`},I=e=>o(F(e)),T=async(e,t,a)=>{const s=await crypto.subtle.importKey("raw",k.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:12e4,hash:"SHA-256"},s,{name:a,length:256},!1,["encrypt","decrypt"])},U=async e=>crypto.subtle.importKey("spki",I(e),{name:"RSA-OAEP",hash:"SHA-256"},!1,["encrypt"]),_=async e=>crypto.subtle.importKey("pkcs8",I(e),{name:"RSA-OAEP",hash:"SHA-256"},!1,["decrypt"]),D=()=>{const e=g?.value??"";return e.trim()?e.trim():(n.textContent="Input masih kosong.",null)},V=e=>{const t=D();if(!t)return null;const a=B?.value??"";if(w(e)==="aes")return a.trim().length<8?(n.textContent="Passphrase minimal 8 karakter untuk keamanan dasar.",null):{passphrase:a,input:t};const s=y?.value?.trim()||"";return s?{passphrase:a,input:t,publicKeyPem:s}:(n.textContent="Untuk RSA encrypt, isi RSA Public Key atau generate keypair dulu.",null)};document.getElementById("generateRsaKeyBtn")?.addEventListener("click",async()=>{try{const e=await crypto.subtle.generateKey({name:"RSA-OAEP",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["encrypt","decrypt"]),t=new Uint8Array(await crypto.subtle.exportKey("spki",e.publicKey)),a=new Uint8Array(await crypto.subtle.exportKey("pkcs8",e.privateKey));y instanceof HTMLTextAreaElement&&(y.value=K(t,"PUBLIC KEY")),f instanceof HTMLTextAreaElement&&(f.value=K(a,"PRIVATE KEY")),n.textContent="RSA keypair berhasil dibuat. Simpan private key dengan aman."}catch(e){n.textContent=`Gagal generate RSA keypair: ${e instanceof Error?e.message:"terjadi kesalahan."}`}});document.getElementById("copyPublicKeyBtn")?.addEventListener("click",async()=>{const e=y?.value||"";e.trim()&&(await navigator.clipboard.writeText(e),n.textContent="Public key tersalin ke clipboard.")});document.getElementById("copyPrivateKeyBtn")?.addEventListener("click",async()=>{const e=f?.value||"";e.trim()&&(await navigator.clipboard.writeText(e),n.textContent="Private key tersalin ke clipboard.")});document.getElementById("encryptBtn")?.addEventListener("click",async()=>{try{const e=R(),t=V(e);if(!t)return;if(w(e)==="rsa"){const p=await U(t.publicKeyPem),h=await crypto.subtle.encrypt({name:"RSA-OAEP"},p,k.encode(t.input));c.value=`LPRSA1.rsa-oaep.${v(new Uint8Array(h))}`,n.textContent="Encrypt RSA berhasil. Decrypt membutuhkan private key yang sesuai.";return}const a=crypto.getRandomValues(new Uint8Array(16)),s=crypto.getRandomValues(new Uint8Array(e.ivLength)),r=await T(t.passphrase,a,e.subtleName),d=await crypto.subtle.encrypt(e.params(s),r,k.encode(t.input)),i=`LPENCv2.${e.key}.${v(a)}.${v(s)}.${v(new Uint8Array(d))}`;c.value=i,n.textContent=`Encrypt berhasil dengan ${e.label}. Simpan ciphertext dan passphrase Anda.`}catch(e){c.value="",n.textContent=`Gagal encrypt: ${e instanceof Error?e.message:"terjadi kesalahan."}`}});document.getElementById("decryptBtn")?.addEventListener("click",async()=>{try{const e=D();if(!e)return;const t=e.split(".");let a=u[0],s,r,d;if(t.length===3&&t[0]==="LPRSA1"&&t[1]==="rsa-oaep"){const b=f?.value?.trim()||"";if(!b){n.textContent="Untuk RSA decrypt, isi RSA Private Key atau generate keypair dulu.";return}const O=await _(b),M=o(t[2]),H=await crypto.subtle.decrypt({name:"RSA-OAEP"},O,M);l instanceof HTMLSelectElement&&(l.value="rsa-oaep",m()),c.value=P.decode(H),n.textContent="Decrypt RSA berhasil. Teks asli dipulihkan.";return}if(t.length===5&&t[0]==="LPENCv2")a=E(t[1]),s=o(t[2]),r=o(t[3]),d=o(t[4]);else if(t.length===4&&t[0]==="LPENCv1")a=E("aes-gcm"),s=o(t[1]),r=o(t[2]),d=o(t[3]);else{n.textContent="Format ciphertext tidak valid. Gunakan LPENCv2 atau LPENCv1.";return}if(w(a)==="rsa"){n.textContent="Ciphertext RSA gunakan format LPRSA1.rsa-oaep.<cipher>.";return}const i=B?.value??"";if(i.trim().length<8){n.textContent="Passphrase minimal 8 karakter untuk keamanan dasar.";return}const p=await T(i,s,a.subtleName),h=await crypto.subtle.decrypt(a.params(r),p,d);l instanceof HTMLSelectElement&&(l.value=a.key,m()),c.value=P.decode(h),n.textContent=`Decrypt berhasil dengan ${a.label}. Teks asli dipulihkan.`}catch{c.value="",n.textContent="Decrypt gagal. Cek passphrase atau pastikan ciphertext tidak berubah."}});document.getElementById("copyAesBtn")?.addEventListener("click",async()=>{c.value&&(await navigator.clipboard.writeText(c.value),n.textContent="Output tersalin ke clipboard.")});
