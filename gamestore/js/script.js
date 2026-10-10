const products = [
  {id:1,name:"Console PlayStation 5",category:"Consoles",price:89999,emoji:"🎮",tag:"En promo",rating:"4.9",reviews:124},
  {id:2,name:"Manette DualSense",category:"Accessoires",price:12999,emoji:"🕹️",tag:"Nouveau",rating:"4.8",reviews:89},
  {id:3,name:"Casque Gaming RGB",category:"Accessoires",price:5999,emoji:"🎧",tag:"Populaire",rating:"4.7",reviews:67},
  {id:4,name:"Souris Gaming RGB",category:"Accessoires",price:3999,emoji:"🖱️",tag:"Top vente",rating:"4.6",reviews:43},
  {id:5,name:"GTA V (PC)",category:"Jeux",price:2999,emoji:"🎮",tag:"Jeux PC",rating:"4.8",reviews:156},
  {id:6,name:"Carte cadeau Gaming",category:"Jeux",price:1999,emoji:"🎁",tag:"Cadeau",rating:"4.5",reviews:98},
  {id:7,name:"Clavier mécanique RGB",category:"Accessoires",price:8499,emoji:"⌨️",tag:"RGB",rating:"4.6",reviews:72},
  {id:8,name:"Console rétro portable",category:"Consoles",price:10999,emoji:"👾",tag:"Nouveau",rating:"4.4",reviews:51}
];
const money = n => new Intl.NumberFormat("fr-DZ").format(n) + " DA";
let category = "Tous";
let cart = JSON.parse(localStorage.getItem("gamestore-cart") || "[]");
const grid = document.querySelector("#productGrid");
const cartPanel = document.querySelector("#cartPanel");
const toast = document.querySelector("#toast");

function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.remove("show"),2200);
}
function renderProducts(){
  const q = document.querySelector("#searchInput").value.trim().toLowerCase();
  const visible = products.filter(p => (category==="Tous" || p.category===category) && p.name.toLowerCase().includes(q));
  grid.innerHTML = visible.length ? visible.map(p=>`
    <article class="product-card">
      <div class="product-visual"><span class="tag">${p.tag}</span><span class="emoji">${p.emoji}</span></div>
      <h3>${p.name}</h3>
      <div class="rating">★★★★★ <span>(${p.reviews})</span></div>
      <div class="price">${money(p.price)}</div>
      <button class="add-btn" data-add="${p.id}">🛒 &nbsp; Ajouter au panier</button>
    </article>`).join("") : `<p class="no-results">Aucun produit trouvé. Essayez une autre recherche.</p>`;
}
function saveCart(){ localStorage.setItem("gamestore-cart",JSON.stringify(cart)); renderCart(); }
function addToCart(id){
  const found=cart.find(item=>item.id===id);
  if(found) found.qty++; else cart.push({id,qty:1});
  saveCart(); showToast("Produit ajouté au panier !");
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  document.querySelector("#cartCount").textContent=count;
  document.querySelector("#cartHeadingCount").textContent=`(${count})`;
  document.querySelector("#cartTotal").textContent=money(total);
  const target=document.querySelector("#cartItems");
  if(!cart.length){target.innerHTML='<p class="empty-cart">Votre panier est vide. Ajoutez un produit !</p>';return;}
  target.innerHTML=cart.map(item=>{
    const p=products.find(product=>product.id===item.id);
    return `<div class="cart-item">
      <div class="mini-visual">${p.emoji}</div>
      <div><h4>${p.name}</h4><p>${money(p.price*item.qty)}</p>
      <div class="qty"><button data-minus="${p.id}" aria-label="Diminuer">−</button><span>${item.qty}</span><button data-plus="${p.id}" aria-label="Augmenter">+</button></div></div>
      <button class="remove-btn" data-remove="${p.id}" aria-label="Supprimer ${p.name}">×</button>
    </div>`;
  }).join("");
}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.querySelector("#cartItems").addEventListener("click",e=>{
  const plus=e.target.closest("[data-plus]"), minus=e.target.closest("[data-minus]"), remove=e.target.closest("[data-remove]");
  if(plus){const item=cart.find(i=>i.id===Number(plus.dataset.plus));if(item)item.qty++;}
  if(minus){const item=cart.find(i=>i.id===Number(minus.dataset.minus));if(item)item.qty--;cart=cart.filter(i=>i.qty>0);}
  if(remove)cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));
  saveCart();
});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");category=btn.dataset.category;renderProducts();
}));
document.querySelector("#searchInput").addEventListener("input",renderProducts);
document.querySelector("#openCart").addEventListener("click",()=>cartPanel.scrollIntoView({behavior:"smooth",block:"center"}));
document.querySelector("#closeCart").addEventListener("click",()=>showToast("Le panier reste disponible à droite."));
document.querySelector("#continueShopping").addEventListener("click",()=>document.querySelector("#produits").scrollIntoView({behavior:"smooth"}));
document.querySelector("#checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){showToast("Votre panier est vide.");return;}
  const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${p.name} x${item.qty} — ${money(p.price*item.qty)}`;}).join("\n");
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  alert("RÉCAPITULATIF DE COMMANDE — DÉMO\n\n"+lines+"\n\nTotal : "+money(total)+"\n\nCeci est une démonstration. Aucun paiement ni commande réelle n'a été envoyé.");
});
document.querySelector("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
